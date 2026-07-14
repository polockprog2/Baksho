import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendWelcomeSubscriptionEmail } from "@/lib/mail";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(req) {
  try {
    const body = await req.json();
    const validated = subscribeSchema.parse(body);

    // Check if already subscribed
    const existing = await prisma.subscriber.findUnique({
      where: { email: validated.email },
    });

    if (existing) {
      if (!existing.isActive) {
        // Reactivate subscription
        await prisma.subscriber.update({
          where: { email: validated.email },
          data: { isActive: true },
        });
        
        // Optionally send a welcome back email
        await sendWelcomeSubscriptionEmail(validated.email);

        return NextResponse.json(
          { message: "Subscription reactivated successfully" },
          { status: 200 }
        );
      }
      
      return NextResponse.json(
        { message: "Email is already subscribed" },
        { status: 400 }
      );
    }

    // Create new subscriber
    await prisma.subscriber.create({
      data: { email: validated.email },
    });

    // Send welcome email
    await sendWelcomeSubscriptionEmail(validated.email);

    return NextResponse.json(
      { message: "Subscribed successfully" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid email address" },
        { status: 400 }
      );
    }
    console.error("Subscription Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
