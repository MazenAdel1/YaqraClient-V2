import { RegisterForm } from "@/components/public/auth";
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
          إنشاء حساب
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
      <CardFooter>
        <p>
          لديك حساب بالفعل؟{" "}
          <Link href="/login" className="font-semibold hover:underline">
            سجل الدخول
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
