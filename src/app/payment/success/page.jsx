import { redirect } from "next/navigation";

import { stripe } from "@/lib/stripe";
import { post } from "@/lib/api";

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id)
    throw new Error("Please provide a valid session_id (`cs_test_...`)");

  const { id, customer_email, status } =
    await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "payment_intent"],
    });

  console.log(id, customer_email, status);

  const handlePymentSuccess = async () => {
    await post(`/payments/payment-success?sessionid=${session_id}`);
    console.log("Payment success handled");
  };

  if (status === "complete") {
    handlePymentSuccess();
    return (
      <section id="success" className="container mx-auto px-4 py-8">
        <p className="text-center">
          We appreciate your business! A confirmation email will be sent to{" "}
          {customer_email}. If you have any questions, please email{" "}
          <a
            href="mailto:orders@example.com"
            className="text-blue-600 hover:underline"
          >
            orders@example.com
          </a>
          .
        </p>
      </section>
    );
  }
}
