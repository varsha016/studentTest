import connectDB from "../../../lib/db";
import Option from "../../../models/admin/OptionModel";

export async function POST(req) {
    try {
        await connectDB();
        const { text, isCorrect } = await req.json();

        if (!text) {
            return new Response(JSON.stringify({ message: "Option text is required" }), { status: 400 });
        }

        const newOption = await Option.create({ text, isCorrect });

        return new Response(JSON.stringify({
            message: "Option added successfully",
            data: newOption
        }), { status: 201 });

    } catch (error) {
        return new Response(JSON.stringify({ message: "Internal Server Error", error: error.message }), { status: 500 });
    }
}
