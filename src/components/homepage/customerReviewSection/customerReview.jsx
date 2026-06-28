import Image from "next/image";
import { FaStar } from "react-icons/fa";

export default function CustomerReviews() {
  // Example dynamic reviews (replace with API data later)
  const reviews = [
    {
      name: "Emily Carter",
      avatar: "https://i.pravatar.cc/100?img=5",
      review:
        "This platform has completely transformed how I use AI prompts. Productivity has skyrocketed!",
      rating: 5,
    },
    {
      name: "James Rodriguez",
      avatar: "https://i.pravatar.cc/100?img=15",
      review:
        "The automation tools are seamless and intuitive. Highly recommend for creative professionals.",
      rating: 4,
    },
    {
      name: "Olivia Brown",
      avatar: "https://i.pravatar.cc/100?img=25",
      review:
        "I love the community-driven approach. Sharing prompts and learning from others is invaluable.",
      rating: 5,
    },
  ];

  return (
    <section className="container-xy py-20">
      <h2 className="section-title mb-12">Customer Reviews</h2>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review, idx) => (
          <div
            key={idx}
            className="card bg-white shadow-lg p-6 rounded-lg hover:shadow-xl transition"
          >
            {/* Avatar */}
            <div className="flex items-center gap-4 mb-4">
              <Image
                src={review.avatar}
                alt={review.name}
                width={64}
                height={64}
                className="w-16 h-16 rounded-full border-2 border-indigo-600"
              />
              <div>
                <h3 className="text-lg font-semibold">{review.name}</h3>
                {/* Rating */}
                <div className="flex text-yellow-500">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
              </div>
            </div>

            {/* Review Text */}
            <p className="text-gray-600">{review.review}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
