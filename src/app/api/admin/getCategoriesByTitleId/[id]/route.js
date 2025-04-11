import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Category from '../../../../models/admin/CategoryModel';
import mongoose from 'mongoose';

export async function GET(req, { params }) {
    await dbConnect();

    const { id } = await params;
    console.log('Fetching categories for TitleCategory ID:', id);

    try {
        const categories = await Category.find({
            titleCategory: new mongoose.Types.ObjectId(id) // ✅ Correct field name
        });

        return NextResponse.json(categories, { status: 200 });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
