import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import NewExpenseForm from "@/components/NewExpenseForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function NewExpensePage() {
  const session = await getSession();
  if (!session) {
    redirect("/login?next=/expense/new");
  }

  return <NewExpenseForm />;
}
