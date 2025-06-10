"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/services/supabaseClient";
import { useUser } from "@/app/provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Star, Crown } from "lucide-react";

const pricingPlans = [
  {
    name: "Starter",
    price: 199,
    credits: 10,
    icon: <Zap className="text-primary w-5 h-5" />,
    recommended: false,
  },
  {
    name: "Pro",
    price: 499,
    credits: 40,
    icon: <Star className="text-yellow-500 w-5 h-5" />,
    recommended: true,
  },
  {
    name: "Premium",
    price: 999,
    credits: 100,
    icon: <Crown className="text-purple-500 w-5 h-5" />,
    recommended: false,
  },
];

export default function BillingPage() {
  const { user } = useUser();
  const [credits, setCredits] = useState(null);

  useEffect(() => {
    const fetchCredits = async () => {
      if (!user?.email) return;

      const { data, error } = await supabase
        .from("Users")
        .select("credits")
        .eq("email", user.email)
        .single();

      if (!error) setCredits(data?.credits);
    };

    fetchCredits();
  }, [user]);

  return (
    <div className="p-2 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Billing & Plans</h1>

      <Card className="mb-8 shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg text-gray-700">
            Remaining Credits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-semibold text-primary">
            {credits ?? "..."}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pricingPlans.map((plan, index) => (
          <Card
            key={index}
            className={`transition-all shadow-md hover:shadow-xl border ${
              plan.recommended
                ? "border-primary ring-2 ring-primary/30"
                : "border-gray-200"
            }`}
          >
            <CardHeader className="flex flex-col items-center gap-2">
              <div className="text-3xl">{plan.icon}</div>
              <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
              {plan.recommended && <Badge variant="outline">Recommended</Badge>}
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <p className="text-4xl font-semibold">₹{plan.price}</p>
              <p className="text-sm text-muted-foreground mb-4">
                {plan.credits} Interview Credits
              </p>
              <Button variant="default">Buy Now</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
