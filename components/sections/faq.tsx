"use client";

import { ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "How does borrowing work?",
    answer:
      "Borrower creates a loan request with desired terms. Lender reviews and fills the request. Borrower receives the asset and must repay within the set duration.",
  },
  {
    question: "How does lending work?",
    answer:
      "Lenders can browse borrower requests, choose the ones that match their risk and return preferences. Once a loan is filled, the borrower receives the funds and must repay within the agreed term.",
  },
  {
    question: "Are there risks?",
    answer:
      "If the borrower fails to repay on time, the loan can be liquidated and collateral distributed to cover the obligation.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      className="py-12 md:py-20 bg-background text-foreground"
      style={{ borderRadius: "60px 60px 0 0" }}
    >
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="heading-lg md:heading-md lg:heading-lg mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground px-4">
            Your questions answered about borrowing, lending, and using Axios
            effectively.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-6 md:space-y-8">
          {faqs.map((faq, index) => (
            <div key={index}>
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left flex items-start justify-between mb-4 hover:opacity-80 transition-opacity p-2 rounded-lg hover:bg-muted/20"
              >
                <h3 className="heading-sm md:heading-sm lg:heading-md text-foreground pr-4 leading-tight">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0 mt-1 p-1">
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground" />
                  )}
                </div>
              </button>
              {openIndex === index && (
                <p className="text-foreground leading-relaxed mb-6 text-sm md:text-base px-2">
                  {faq.answer}
                </p>
              )}
              {index < faqs.length - 1 && (
                <div className="border-t border-border"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
