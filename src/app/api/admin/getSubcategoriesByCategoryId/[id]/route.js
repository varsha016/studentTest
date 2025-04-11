

import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Subcategory from '../../../../models/admin/SubCategoryModel';
import mongoose from 'mongoose';
export async function GET(req, { params }) {
    await dbConnect();

    const { id } = await params;

    try {
        const subcategories = await Subcategory.find({
            category: new mongoose.Types.ObjectId(id) // ✅ use 'category' field from schema
        });

        return NextResponse.json(subcategories, { status: 200 });
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
