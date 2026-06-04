import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface OrderRequestItem {
  id: string;
  quantity: number;
}

interface OrderRequestBody {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryDate: string;
  notes?: string;
  items: OrderRequestItem[];
  deliveryMode: 'PICKUP' | 'DELIVERY';
  deliveryAddress?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as OrderRequestBody;
    const {
      customerName,
      customerEmail,
      customerPhone,
      deliveryDate,
      notes,
      items,
      deliveryMode,
      deliveryAddress,
    } = body;

    // 1. Basic validation
    if (!customerName || !customerEmail || !customerPhone || !deliveryDate || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required order fields or items are empty.' },
        { status: 400 }
      );
    }

    // 2. Fetch product details from DB and calculate totalAmount securely
    const productIds = items.map((item) => item.id);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (dbProducts.length === 0) {
      return NextResponse.json(
        { error: 'None of the selected products were found in the database.' },
        { status: 404 }
      );
    }

    let calculatedTotal = 0;
    const formattedItems = [];

    for (const item of items) {
      const dbProduct = dbProducts.find((p) => p.id === item.id);
      if (!dbProduct) {
        return NextResponse.json(
          { error: `Product with ID ${item.id} not found.` },
          { status: 404 }
        );
      }
      if (!dbProduct.isAvailable) {
        return NextResponse.json(
          { error: `Product ${dbProduct.name} is currently out of stock.` },
          { status: 400 }
        );
      }

      calculatedTotal += dbProduct.price * item.quantity;
      formattedItems.push({
        id: dbProduct.id,
        name: dbProduct.name,
        flavour: dbProduct.flavour,
        size: dbProduct.size,
        price: dbProduct.price,
        quantity: item.quantity,
      });
    }

    // 3. Generate a random 6-digit delivery verification OTP
    const deliveryOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // 4. Construct address information
    const fullNotes = `Mode: ${deliveryMode}${deliveryAddress ? ` | Address: ${deliveryAddress}` : ''}${notes ? ` | Notes: ${notes}` : ''}`;

    // 5. Create Order in the SQLite database
    const order = await prisma.order.create({
      data: {
        customerName,
        customerEmail,
        customerPhone,
        deliveryDate: new Date(deliveryDate),
        notes: fullNotes,
        totalAmount: calculatedTotal,
        status: 'PENDING_PAYMENT',
        items: JSON.stringify(formattedItems),
        deliveryOtp,
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Internal server error while processing your order.' },
      { status: 500 }
    );
  }
}
