import { LoginForm } from "@/components/public/auth";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function Page() {
  return (
    <Card className="animate-in fade-in zoom-in-95 w-full sm:w-md">
      <CardHeader>
        <CardTitle className="font-yoc text-center text-xl font-bold">
          تسجيل الدخول
        </CardTitle>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
      <CardFooter>
        <p>
          لا تملك حسابًا؟{" "}
          <Link href="/register" className="font-semibold hover:underline">
            سجل الآن
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
