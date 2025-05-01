



// import { NextResponse } from "next/server";
// import connectDB from "../../../lib/db";
// import Question from "../../../models/admin/QuestionModel";
// import Permission from "../../../models/admin/Permission";
// import SubCategory from "../../../models/admin/SubCategoryModel"; // ✅ import this
// import { authenticate } from "../../../lib/auth/auth";

// export async function POST(req) {
//     try {
//         await connectDB();

//         // Authenticate the user
//         const { operator } = await authenticate(req);
//         console.log("Authenticated Operator:", operator);

//         if (!operator) {
//             return NextResponse.json({ message: "Unauthorized: Operator not found" }, { status: 401 });
//         }
//         console.log("Operator:", operator);

//         if (!operator.operators || operator.operators.length === 0) {
//             return NextResponse.json({ message: "Unauthorized: No operators found" }, { status: 401 });
//         }

//         // Find an operator with permission
//         const authorizedOperator = await Promise.all(
//             operator.operators.map(async (op) => {
//                 if (!op.permissionId) return null; // Skip if no permissionId
//                 const permission = await Permission.findById(op.permissionId);
//                 if (permission?.addQuestion) {
//                     return { operator: op, permission };
//                 }
//                 return null;
//             })
//         );

//         // Filter valid operators with permission
//         const validOperator = authorizedOperator.find((op) => op !== null);

//         if (!validOperator) {
//             return NextResponse.json({ message: "Forbidden: No operators with permission to add questions" }, { status: 403 });
//         }


//         const { operator: selectedOperator } = validOperator;

//         // Proceed with creating the question
//         const {
//             subCategory,
//             questionText,
//             questionType,
//             options,
//             correctOptionIndex,
//             directAnswer,
//             answerExplanation,
//         } = await req.json();


//         if (!subCategory || !questionText || !questionType) {
//             return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
//         }

//         if (
//             questionType === "mcq" &&
//             (!Array.isArray(options) || options.length < 2 || correctOptionIndex === undefined || correctOptionIndex >= options.length)
//         ) {
//             return NextResponse.json({ message: "Invalid MCQ question data" }, { status: 400 });
//         }
//         console.log(selectedOperator._id, "selectedOperator._id");


//         const questionData = {
//             subCategory,
//             questionText,
//             questionType,
//             options: questionType === "mcq" ? options : [],
//             correctOptionIndex: questionType === "mcq" ? correctOptionIndex : null,
//             directAnswer: questionType === "direct" ? directAnswer : "",
//             answerExplanation,
//             createdBy: selectedOperator._id,
//             status: "draft",
//         };

//         const newQuestion = await Question.create(questionData);
//         return NextResponse.json({ message: "Question added successfully", data: newQuestion }, { status: 201 });


//     } catch (error) {
//         console.error("Error adding question:", error);
//         return NextResponse.json({ message: error.message }, { status: 500 });
//     }
// }



// import { NextResponse } from "next/server";

// import connectDB from "../../../lib/db";
// import Question from "../../../models/admin/QuestionModel";
// import Permission from "../../../models/admin/Permission";
// import Category from "../../../models/admin/CategoryModel";
// import SubCategory from "../../../models/admin/SubCategoryModel";

// import { NextResponse } from "next/server";

// import { authenticate } from "../../../lib/auth/auth";

// export async function POST(req) {
//     try {
//         console.log("Request Body:", req.body);

//         await connectDB();

//         // Authenticate the user (operator/admin hybrid handling)
//         const { operator } = await authenticate(req);
//         console.log("Operator Data:", operator);

//         if (!operator) {
//             return NextResponse.json({ message: "Unauthorized: Operator not found" }, { status: 401 });
//         }

//         if (!operator.operators || operator.operators.length === 0) {
//             return NextResponse.json({ message: "Unauthorized: No operators found" }, { status: 401 });
//         }

//         // Check for permission to add questions
//         const authorizedOperator = await Promise.all(
//             operator.operators.map(async (op) => {
//                 if (!op.permissionId) return null;
//                 const permission = await Permission.findById(op.permissionId);
//                 if (permission?.addQuestion) {
//                     return { operator: op, permission };
//                 }
//                 return null;
//             })
//         );

//         const validOperator = authorizedOperator.find((op) => op !== null);
//         if (!validOperator) {
//             return NextResponse.json({ message: "Forbidden: No operators with permission to add questions" }, { status: 403 });
//         }

//         const { operator: selectedOperator } = validOperator;

//         const {
//             subCategory,
//             category,
//             questionText,
//             questionType,
//             options,
//             correctOptionIndex,
//             directAnswer,
//             answerExplanation,
//         } = await req.json();

//         // Basic validation
//         if (!subCategory || !category || !questionText || !questionType) {
//             return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
//         }

//         // Question type specific validation
//         if (questionType === "mcq") {
//             if (!Array.isArray(options) || options.length < 2) {
//                 return NextResponse.json({ message: "MCQ must have at least 2 options" }, { status: 400 });
//             }

//             if (
//                 typeof correctOptionIndex !== "number" ||
//                 correctOptionIndex < 0 ||
//                 correctOptionIndex >= options.length
//             ) {
//                 return NextResponse.json({ message: "Invalid correctOptionIndex for MCQ" }, { status: 400 });
//             }
//         }

//         if (questionType === "truefalse") {
//             if (typeof correctOptionIndex !== "number" || ![0, 1].includes(correctOptionIndex)) {
//                 return NextResponse.json({ message: "Invalid correctOptionIndex for True/False" }, { status: 400 });
//             }
//         }

//         if (questionType === "direct" && !directAnswer) {
//             return NextResponse.json({ message: "Direct answer is required" }, { status: 400 });
//         }

//         // Validate category and subcategory
//         const categoryExists = await Category.findById(category);
//         if (!categoryExists) {
//             return NextResponse.json({ message: "Category not found" }, { status: 400 });
//         }

//         const subCategoryExists = await SubCategory.findById(subCategory);
//         if (!subCategoryExists) {
//             return NextResponse.json({ message: "SubCategory not found" }, { status: 400 });
//         }

//         // Prepare correct answer
//         let correctAnswer = null;

//         if (questionType === "mcq") {
//             correctAnswer = options[correctOptionIndex];
//         } else if (questionType === "truefalse") {
//             correctAnswer = correctOptionIndex === 0 ? "true" : "false";
//         } else if (questionType === "direct") {
//             correctAnswer = directAnswer;
//         }

//         const questionData = {
//             subCategory,
//             category,
//             questionText,
//             questionType,
//             options: questionType === "mcq" ? options : questionType === "truefalse" ? ["true", "false"] : [],
//             correctOptionIndex:
//                 questionType === "mcq" || questionType === "truefalse" ? correctOptionIndex : null,
//             directAnswer: questionType === "direct" ? directAnswer : null,
//             correctAnswer,
//             answerExplanation,
//             createdBy: selectedOperator._id,
//             status: "draft",
//         };

//         const newQuestion = await Question.create(questionData);

//         return NextResponse.json({ message: "Question added successfully", data: newQuestion }, { status: 201 });
//     } catch (error) {
//         console.error("Error adding question:", error);
//         return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
//     }
// }


import connectDB from "../../../lib/db";
import Question from "../../../models/admin/QuestionModel";
import Permission from "../../../models/admin/Permission";
import Category from "../../../models/admin/CategoryModel";
import SubCategory from "../../../models/admin/SubCategoryModel";
import { NextResponse } from "next/server";
import { authenticate } from "../../../lib/auth/auth";

export async function POST(req) {
    try {
        console.log("Request Body:", req.body);

        await connectDB();

        // Authenticate the user (operator/admin hybrid handling)
        const { operator } = await authenticate(req);
        console.log("Operator Data:", operator);

        if (!operator) {
            return NextResponse.json({ message: "Unauthorized: Operator not found" }, { status: 401 });
        }

        // Check if the operator has permission to add questions
        if (!operator.permissionId) {
            return NextResponse.json({ message: "Unauthorized: No permission ID found for the operator" }, { status: 401 });
        }

        const permission = await Permission.findById(operator.permissionId);
        if (!permission || !permission.addQuestion) {
            return NextResponse.json({ message: "Forbidden: Operator does not have permission to add questions" }, { status: 403 });
        }

        const {
            subCategory,
            category,
            questionText,
            questionType,
            options,
            correctOptionIndex,
            directAnswer,
            answerExplanation,
        } = await req.json();

        // Basic validation
        if (!subCategory || !category || !questionText || !questionType) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        // Question type specific validation
        if (questionType === "mcq") {
            if (!Array.isArray(options) || options.length < 2) {
                return NextResponse.json({ message: "MCQ must have at least 2 options" }, { status: 400 });
            }

            if (
                typeof correctOptionIndex !== "number" ||
                correctOptionIndex < 0 ||
                correctOptionIndex >= options.length
            ) {
                return NextResponse.json({ message: "Invalid correctOptionIndex for MCQ" }, { status: 400 });
            }
        }

        if (questionType === "truefalse") {
            if (typeof correctOptionIndex !== "number" || ![0, 1].includes(correctOptionIndex)) {
                return NextResponse.json({ message: "Invalid correctOptionIndex for True/False" }, { status: 400 });
            }
        }

        if (questionType === "direct" && !directAnswer) {
            return NextResponse.json({ message: "Direct answer is required" }, { status: 400 });
        }

        // Validate category and subcategory
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return NextResponse.json({ message: "Category not found" }, { status: 400 });
        }

        const subCategoryExists = await SubCategory.findById(subCategory);
        if (!subCategoryExists) {
            return NextResponse.json({ message: "SubCategory not found" }, { status: 400 });
        }

        // Prepare correct answer
        let correctAnswer = null;

        if (questionType === "mcq") {
            correctAnswer = options[correctOptionIndex];
        } else if (questionType === "truefalse") {
            correctAnswer = correctOptionIndex === 0 ? "true" : "false";
        } else if (questionType === "direct") {
            correctAnswer = directAnswer;
        }

        const questionData = {
            subCategory,
            category,
            questionText,
            questionType,
            options: questionType === "mcq" ? options : questionType === "truefalse" ? ["true", "false"] : [],
            correctOptionIndex:
                questionType === "mcq" || questionType === "truefalse" ? correctOptionIndex : null,
            directAnswer: questionType === "direct" ? directAnswer : null,
            correctAnswer,
            answerExplanation,
            createdBy: operator._id,
            status: "draft",
        };

        const newQuestion = await Question.create(questionData);

        return NextResponse.json({ message: "Question added successfully", data: newQuestion }, { status: 201 });
    } catch (error) {
        console.error("Error adding question:", error);
        return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
    }
}
