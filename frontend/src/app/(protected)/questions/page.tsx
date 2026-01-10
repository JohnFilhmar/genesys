"use client";

import { withAuth } from "@/middleware";
import Questions from "./questions";

function QuestionsPage() {
  return (
    <Questions />
  );
}

export default withAuth(QuestionsPage);