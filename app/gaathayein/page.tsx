import type { Metadata } from "next";
import NotesApp from "../_components/NotesApp";

export const metadata: Metadata = {
  title: "Bhavyaa ki gaathayein",
  description: "Things Bhavyaa says, saved forever.",
};

export default function GaathayeinPage() {
  return <NotesApp />;
}
