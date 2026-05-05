export type PromiseStatus = "pending" | "partial" | "fulfilled" | "broken";

export interface BJPPromise {
  id: string;
  icon: string;
  titleBengali: string;
  titleEnglish: string;
  descriptionBengali: string;
  descriptionEnglish: string;
  amount: string;
  category: "financial" | "housing" | "health" | "employment" | "women" | "youth" | "elderly";
  status: PromiseStatus;
  color: string;
}

export const BJP_PROMISES: BJPPromise[] = [
  {
    id: "food-allowance",
    icon: "🍚",
    titleBengali: "অন্ন সহায়তা ভাতা",
    titleEnglish: "Food Assistance Allowance",
    descriptionBengali: "প্রতিটি পরিবারকে প্রতি মাসে অন্ন সহায়তার জন্য ₹৩,০০০ ভাতা প্রদান",
    descriptionEnglish: "₹3,000 per month food assistance allowance for every family",
    amount: "₹3,000/month",
    category: "financial",
    status: "pending",
    color: "from-red-500 to-orange-500",
  },
  {
    id: "youth-unemployment",
    icon: "🎓",
    titleBengali: "বেকার যুবক ভাতা",
    titleEnglish: "Youth Unemployment Allowance",
    descriptionBengali: "বেকার যুবকদের জন্য মাসিক ₹৩,০০০ আর্থিক সহায়তা প্রদান",
    descriptionEnglish: "Monthly ₹3,000 financial assistance for unemployed youth",
    amount: "₹3,000/month",
    category: "youth",
    status: "pending",
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: "pm-awas-housing",
    icon: "🏠",
    titleBengali: "প্রধানমন্ত্রী আবাস প্রকল্প",
    titleEnglish: "PM Awas Housing Scheme",
    descriptionBengali: "প্রধানমন্ত্রী আবাস প্রকল্পে প্রত্যেক পরিবারকে ₹৩ লক্ষ টাকার ঘর প্রদান",
    descriptionEnglish: "₹3 lakh home for every family under PM Awas Yojana",
    amount: "₹3 Lakh",
    category: "housing",
    status: "pending",
    color: "from-green-500 to-emerald-600",
  },
  {
    id: "pregnant-women",
    icon: "🤰",
    titleBengali: "গর্ভবতী মহিলা সহায়তা",
    titleEnglish: "Pregnant Women Financial Aid",
    descriptionBengali: "গর্ভবতী মহিলাদের জন্য ₹২১,০০০ আর্থিক সহায়তা প্রদান",
    descriptionEnglish: "₹21,000 financial assistance for pregnant women",
    amount: "₹21,000",
    category: "women",
    status: "pending",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "free-electricity",
    icon: "💡",
    titleBengali: "বিনামূল্যে বিদ্যুৎ",
    titleEnglish: "Free Electricity",
    descriptionBengali: "প্রতি মাসে ২০০ ইউনিট পর্যন্ত বিদ্যুৎ সম্পূর্ণ বিনামূল্যে",
    descriptionEnglish: "Up to 200 units of electricity free per month",
    amount: "200 Units Free",
    category: "financial",
    status: "pending",
    color: "from-yellow-500 to-amber-500",
  },
  {
    id: "women-free-bus",
    icon: "🚌",
    titleBengali: "মহিলাদের বিনামূল্যে বাস যাতায়াত",
    titleEnglish: "Free Bus Travel for Women",
    descriptionBengali: "সরকারি বাসে সকল মহিলাদের জন্য বিনামূল্যে যাতায়াত সুবিধা",
    descriptionEnglish: "Free travel on all government buses for women",
    amount: "Free Travel",
    category: "women",
    status: "pending",
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "elderly-widow-allowance",
    icon: "👴",
    titleBengali: "বয়স্ক ও বিধবা ভাতা বৃদ্ধি",
    titleEnglish: "Elderly & Widow Allowance Increase",
    descriptionBengali: "বয়স্ক ও বিধবাদের ভাতা ₹৩,০০০ পর্যন্ত বৃদ্ধি করা",
    descriptionEnglish: "Increase in elderly and widow allowance up to ₹3,000 per month",
    amount: "Up to ₹3,000/month",
    category: "elderly",
    status: "pending",
    color: "from-orange-500 to-amber-600",
  },
  {
    id: "job-exam-grant",
    icon: "📋",
    titleBengali: "চাকরির পরীক্ষার প্রস্তুতি অনুদান",
    titleEnglish: "Job Exam Preparation Grant",
    descriptionBengali: "চাকরির পরীক্ষার প্রস্তুতির জন্য পরীক্ষার্থীদের ₹১৫,০০০ এককালীন অনুদান",
    descriptionEnglish: "₹15,000 one-time grant for job exam preparation",
    amount: "₹15,000 One-time",
    category: "youth",
    status: "pending",
    color: "from-teal-500 to-cyan-600",
  },
  {
    id: "health-coverage",
    icon: "🛡️",
    titleBengali: "স্বাস্থ্য বীমা কভারেজ",
    titleEnglish: "Health Insurance Coverage",
    descriptionBengali: "প্রতিটি পরিবারের জন্য স্বাস্থ্য পরিষেবায় ₹৫ লক্ষ পর্যন্ত কভারেজ",
    descriptionEnglish: "Up to ₹5 lakh health coverage for every family",
    amount: "₹5 Lakh Coverage",
    category: "health",
    status: "pending",
    color: "from-green-600 to-teal-600",
  },
  {
    id: "employment-days",
    icon: "⛏️",
    titleBengali: "কর্মসংস্থান দিন বৃদ্ধি",
    titleEnglish: "Employment Days Increase",
    descriptionBengali: "১০০ দিনের কাজ বাড়িয়ে ১২৫ দিনের কর্মসংস্থান নিশ্চিত করা",
    descriptionEnglish: "Increase employment guarantee from 100 days to 125 days",
    amount: "100 → 125 Days",
    category: "employment",
    status: "pending",
    color: "from-brown-500 to-amber-700",
  },
];

export const STATUS_CONFIG: Record<PromiseStatus, { label: string; bengali: string; color: string; bg: string; border: string }> = {
  pending: {
    label: "Pending",
    bengali: "অপেক্ষমাণ",
    color: "text-amber-700",
    bg: "bg-amber-100",
    border: "border-amber-300",
  },
  partial: {
    label: "Partially Done",
    bengali: "আংশিক পূরণ",
    color: "text-blue-700",
    bg: "bg-blue-100",
    border: "border-blue-300",
  },
  fulfilled: {
    label: "Fulfilled",
    bengali: "পূরণ হয়েছে",
    color: "text-green-700",
    bg: "bg-green-100",
    border: "border-green-300",
  },
  broken: {
    label: "Broken",
    bengali: "ভঙ্গ হয়েছে",
    color: "text-red-700",
    bg: "bg-red-100",
    border: "border-red-300",
  },
};
