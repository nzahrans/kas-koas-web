import { getMembersList } from "@/actions/member";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import NewIncomeForm from "@/components/NewIncomeForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function NewIncomePage() {
  const session = await getSession();
  if (!session) {
    redirect("/login?next=/income/new");
  }

  const members = await getMembersList();

  return <NewIncomeForm members={members} />;
}
