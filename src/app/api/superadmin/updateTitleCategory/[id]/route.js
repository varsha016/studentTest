import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import TitleCategory from '../../../../models/admin/TitleCategoryModel';
import { authenticate } from '../../../../lib/auth/auth';

export async function PUT(request, { params }) {
    await dbConnect();
    await authenticate(request);
    const { id } = await params;
    const body = await request.json();

    try {
        const updated = await TitleCategory.findByIdAndUpdate(id, { title: body.title }, { new: true });
        return NextResponse.json(updated, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to update title category.' }, { status: 500 });
    }
}
