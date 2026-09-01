import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import NewExpenseForm from "@/components/NewExpenseForm";

export default async function NewExpensePage() {
  const session = await getSession();
  if (!session) {
    redirect("/login?next=/expense/new");
  }

  return <NewExpenseForm />;
}
