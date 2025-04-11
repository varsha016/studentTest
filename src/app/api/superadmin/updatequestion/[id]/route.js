import { authenticate } from '../../../../lib/auth/auth';
import dbConnect from '../../../../lib/db';
import Question from '../../../../models/admin/QuestionModel';
import { NextResponse } from 'next/server';


export async function PUT(request, { params }) {
    await dbConnect();
    await authenticate(request);

    const { id } = params;
    const body = await request.json();

    try {
        const updateFields = {};

        if (body.questionText) updateFields.questionText = body.questionText;
        if (body.options) updateFields.options = body.options;
        if (body.correctOptionIndex !== undefined) updateFields.correctOptionIndex = body.correctOptionIndex;
        if (body.directAnswer) updateFields.directAnswer = body.directAnswer;
        if (body.answerExplanation) updateFields.answerExplanation = body.answerExplanation;
        if (body.subCategory) updateFields.subCategory = body.subCategory;
        if (body.status) updateFields.status = body.status;

        updateFields.updatedAt = new Date();

        const updated = await Question.findByIdAndUpdate(id, updateFields, { new: true });

        if (!updated) {
            return NextResponse.json({ error: 'Question not found.' }, { status: 404 });
        }

        return NextResponse.json(updated, { status: 200 });
    } catch (err) {
        console.error('Update error:', err);
        return NextResponse.json({ error: 'Failed to update question.' }, { status: 500 });
    }
}



// export async function PUT(request, { params }) {
//     await dbConnect();
//     await authenticate(request);

//     const { id } = params;
//     const body = await request.json();

//     try {
//         const updated = await Question.findByIdAndUpdate(
//             id,
//             {
//                 question: body.question,
//                 // options: body.options,
//                 // answer: body.answer,
//                 // subCategoryId: body.subCategoryId,
//             },
//             { new: true }
//         );

//         return NextResponse.json(updated, { status: 200 });
//     } catch (err) {
//         return NextResponse.json({ error: 'Failed to update question.' }, { status: 500 });
//     }
// }
