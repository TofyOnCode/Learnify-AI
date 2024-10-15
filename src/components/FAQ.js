import React, { useState } from 'react';

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4">
      <button
        className="flex justify-between items-center w-full text-left p-4 bg-gray-800 hover:bg-gray-700 transition duration-300 rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-semibold text-white">{question}</span>
        <svg
          className={`w-6 h-6 text-green-400 transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="p-4 bg-gray-700 text-gray-300 rounded-b-md">
          {answer}
        </div>
      )}
    </div>
  );
}

function FAQ() {
  const faqs = [
    {
      question: "Kako deluje Learnify AI?",
      answer: "Learnify AI uporablja napredne algoritme strojnega učenja za analizo vaših matematičnih nalog in zagotavljanje personaliziranih razlag in rešitev."
    },
    {
      question: "Ali lahko Learnify AI uporabljam na mobilni napravi?",
      answer: "Da, Learnify AI je na voljo kot spletna aplikacija in deluje na vseh napravah z internetno povezavo."
    },
    {
      question: "Kako dolgo traja brezplačno preizkusno obdobje?",
      answer: "Brezplačno preizkusno obdobje traja 7 dni, v tem času lahko neomejeno uporabljate vse funkcije Learnify AI."
    },
    {
      question: "Ali lahko prekinem naročnino kadarkoli?",
      answer: "Da, naročnino lahko prekineš kadarkoli brez dodatnih stroškov."
    },
    {
      question: "Ali Learnify AI podpira vse matematične teme?",
      answer: "Learnify AI pokriva širok spekter matematičnih tem od osnovne do višje matematike, vključno z algebro, geometrijo, trigonometrijo in kalkulusom."
    },
    {
      question: "Kako hitro lahko pričakujem izboljšanje ocen?",
      answer: "Rezultati se razlikujejo od posameznika do posameznika, vendar večina uporabnikov opazi izboljšanje v roku enega meseca redne uporabe."
    }
  ];

  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">Pogosta vprašanja</h2>
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <FAQItem key={index} {...faq} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQ;
