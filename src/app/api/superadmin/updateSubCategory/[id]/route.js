import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import SubCategory from '../../../../models/admin/SubCategoryModel';
import { authenticate } from '../../../../lib/auth/auth';

export async function PUT(request, { params }) {
    await dbConnect();
    await authenticate(request);
    const { id } = await params;
    const body = await request.json();

    try {
        const updated = await SubCategory.findByIdAndUpdate(id, {
            name: body.name,
            categoryId: body.categoryId,
        }, { new: true });

        return NextResponse.json(updated, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to update subcategory.' }, { status: 500 });
    }
}
