import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface FeatureCardProps {
    title: string;
    description: string;
}

export default function FeatureCard({ title, description }: FeatureCardProps) {
    return (
        <Card className="border-none shadow-lg">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-[#2d5016]">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription className="text-gray-700 leading-relaxed">
                    {description}
                </CardDescription>
            </CardContent>
        </Card>
    );
}