// import Section from "../../../models/admin/sectionModel";
// import connectDB from "../../../lib/db";
// import Question from "../../../models/admin/QuestionModel";
// import Category from "../../../models/admin/CategoryModel";
// import SubCategory from "../../../models/admin/SubCategoryModel";


// export async function POST(req) {
//     try {
//         await connectDB();

//         // Parse request JSON
//         const { subCategoryId, categoryId, name, questionLimit, questionIds } = await req.json();

//         // Convert questionLimit to a number
//         const parsedQuestionLimit = Number(questionLimit);

//         // Validate inputs
//         if (!subCategoryId || !categoryId || !name || !questionLimit) {
//             return new Response(JSON.stringify({ message: "Missing required fields" }), { status: 400 });
//         }

//         // Validate Question Limit (3, 20, 30)
//         if (![5, 20, 30].includes(parsedQuestionLimit)) {
//             return new Response(JSON.stringify({ message: "Invalid question limit" }), { status: 400 });
//         }

//         // Check if SubCategory and Category exist
//         const subCategory = await SubCategory.findById(subCategoryId);
//         const category = await Category.findById(categoryId);
//         if (!subCategory || !category) {
//             return new Response(JSON.stringify({ message: "SubCategory or Category not found" }), { status: 404 });
//         }

//         // ✅ Check if the section name already exists (Prevents Duplicate Name Error)
//         const existingSection = await Section.findOne({ name });
//         if (existingSection) {
//             return new Response(JSON.stringify({ message: "Section name already exists" }), { status: 409 }); // 409 Conflict
//         }

//         // Validate questions if provided
//         let questions = [];
//         if (questionIds?.length > 0) {
//             questions = await Question.find({ _id: { $in: questionIds } });
//             if (questions.length !== questionIds.length) {
//                 return new Response(JSON.stringify({ message: "Invalid question IDs" }), { status: 400 });
//             }
//         }

//         // Create new section
//         const newSection = new Section({
//             subCategory: subCategoryId,
//             category: categoryId,
//             name,
//             questionLimit: parsedQuestionLimit, // Use parsed question limit
//             questions: questions.map(q => q._id),
//         });

//         await newSection.save();

//         return new Response(JSON.stringify({ message: "Section created successfully", section: newSection }), {
//             status: 201
//         });
//     } catch (error) {
//         console.error("Error creating section:", error);
//         return new Response(JSON.stringify({ message: "Internal Server Error", error: error.message }), { status: 500 });
//     }
// }




import Section from "../../../models/admin/sectionModel";
import connectDB from "../../../lib/db";
import Question from "../../../models/admin/QuestionModel";
import Category from "../../../models/admin/CategoryModel";
import SubCategory from "../../../models/admin/SubCategoryModel";

export async function POST(req) {
    try {
        await connectDB();

        // Parse request JSON
        const { subCategoryId, categoryId, name, questionIds } = await req.json();

        // Validate inputs
        if (!subCategoryId || !categoryId || !name || !questionIds || questionIds.length === 0) {
            return new Response(JSON.stringify({ message: "Missing required fields or no questions provided" }), { status: 400 });
        }

        // Check if SubCategory and Category exist
        const subCategory = await SubCategory.findById(subCategoryId);
        const category = await Category.findById(categoryId);
        if (!subCategory || !category) {
            return new Response(JSON.stringify({ message: "SubCategory or Category not found" }), { status: 404 });
        }

        // Validate questions
        const questions = await Question.find({ _id: { $in: questionIds } });
        if (questions.length !== questionIds.length) {
            return new Response(JSON.stringify({ message: "Invalid question IDs" }), { status: 400 });
        }

        // ✅ Calculate how many sections are needed
        const maxQuestionsPerSection = 10;
        const totalSections = Math.ceil(questions.length / maxQuestionsPerSection);

        const createdSections = [];

        for (let i = 0; i < totalSections; i++) {
            const sectionQuestions = questions.slice(i * maxQuestionsPerSection, (i + 1) * maxQuestionsPerSection);

            const newSection = new Section({
                subCategory: subCategoryId,
                category: categoryId,
                name: `${name} - Part ${i + 1}`,
                questionLimit: sectionQuestions.length,
                questions: sectionQuestions.map((q) => q._id),
            });

            await newSection.save();
            createdSections.push(newSection);
        }

        return new Response(
            JSON.stringify({
                message: `${createdSections.length} section(s) created successfully`,
                sections: createdSections,
            }),
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating section:", error);
        return new Response(
            JSON.stringify({ message: "Internal Server Error", error: error.message }),
            { status: 500 }
        );
    }
}
