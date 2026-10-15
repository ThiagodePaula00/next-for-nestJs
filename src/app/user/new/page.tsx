import { CreateUserForm } from "@/src/components/CreateUserForm";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crie sua conta',
};

export default async function CreateUserPage() {
  return <CreateUserForm />;
}