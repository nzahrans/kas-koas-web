import { getSession } from "@/lib/auth";
import { getMembersList } from "@/actions/member";
import { getTransactionById } from "@/actions/transaction";
import { redirect, notFound } from "next/navigation";
import EditTransactionForm from "@/components/EditTransactionForm";

interface EditTransactionPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EditTransactionPage({ params }: EditTransactionPageProps) {
  const session = await getSession();
  const { id } = await params;
  const transactionId = parseInt(id, 10);

  if (!session || (session.role !== "ADMIN" && session.role !== "BENDAHARA")) {
    redirect(`/login?next=/transactions/${id}/edit`);
  }

  if (isNaN(transactionId)) {
    notFound();
  }

  const [transaction, members] = await Promise.all([
    getTransactionById(transactionId),
    getMembersList(),
  ]);

  if (!transaction) {
    notFound();
  }

  return (
    <EditTransactionForm
      transaction={{
        id: transaction.id,
        type: transaction.type,
        kasType: transaction.kasType,
        amount: transaction.amount,
        date: transaction.date,
        category: transaction.category,
        payerPayee: transaction.payerPayee,
        notes: transaction.notes,
        memberId: transaction.memberId,
      }}
      members={members}
    />
  );
}
