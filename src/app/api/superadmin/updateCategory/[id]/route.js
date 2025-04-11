import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Category from '../../../../models/admin/CategoryModel';
import { authenticate } from '../../../../lib/auth/auth';

export async function PUT(request, { params }) {
    await dbConnect();
    await authenticate(request);
    const { id } = await params;
    const body = await request.json();

    try {
        const updated = await Category.findByIdAndUpdate(id, { name: body.name }, { new: true });
        return NextResponse.json(updated, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to update category.' }, { status: 500 });
    }
}
