import { redirect } from 'next/navigation';

// /ekonom redirects to /tarify (which covers all tariffs including ekonom)
export default function EkonomPage() {
    redirect('/tarify');
}
