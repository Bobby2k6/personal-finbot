import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle, Github, Linkedin } from "lucide-react";

const teamMembers = [
  {
    name: "Sk. Saifullah",
    email: "323103310223@gvpce.ac.in",
    role: "Lead Developer",
    bio: "Full-stack developer specializing in React and Node.js",
  },
  {
    name: "M V Karthikeyan",
    email: "323103310154@gvpce.ac.in",
    role: "Frontend Developer",
    bio: "UI/UX enthusiast with expertise in modern web technologies",
  },
  {
    name: "N Pavan Sarvesh",
    email: "323103310165@gvpce.ac.in",
    role: "Backend Developer",
    bio: "Backend architecture and database optimization specialist",
  },
];

export default function Contact() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Contact Us
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Have questions about FinanceBot? We'd love to hear from you. Send us a
          message and we'll respond as soon as possible.
        </p>
      </div>

      {/* Quick Contact */}
      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-emerald-600" />
            Get in Touch
          </CardTitle>
          <CardDescription>
            For general inquiries, feature requests, or support, reach out to
            our team
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              asChild
            >
              <a href="mailto:team@financebot.com">
                <Mail className="h-6 w-6 text-emerald-600" />
                <span className="font-medium">General Support</span>
                <span className="text-sm text-gray-500">
                  team@financebot.com
                </span>
              </a>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              asChild
            >
              <a href="mailto:bugs@financebot.com">
                <MessageCircle className="h-6 w-6 text-emerald-600" />
                <span className="font-medium">Bug Reports</span>
                <span className="text-sm text-gray-500">
                  bugs@financebot.com
                </span>
              </a>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              asChild
            >
              <a href="mailto:features@financebot.com">
                <Github className="h-6 w-6 text-emerald-600" />
                <span className="font-medium">Feature Requests</span>
                <span className="text-sm text-gray-500">
                  features@financebot.com
                </span>
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Team Members */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
          Meet Our Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </span>
                </div>
                <CardTitle className="text-lg">{member.name}</CardTitle>
                <CardDescription className="font-medium text-emerald-600">
                  {member.role}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {member.bio}
                </p>

                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    asChild
                  >
                    <a href={`mailto:${member.email}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      {member.email}
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>
            Common questions about FinanceBot and how to use it
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Is my financial data secure?
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Yes, we use industry-standard encryption to protect your data.
                Your financial information is stored securely and is never
                shared with third parties.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Can I use FinanceBot for family finances?
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Absolutely! FinanceBot supports family mode where you can
                combine incomes and track shared expenses with family members.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                How does the AI chatbot work?
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Our AI assistant analyzes your financial data to provide
                personalized advice, answer questions, and help you make better
                financial decisions.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Is there a mobile app?
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Currently, FinanceBot is a responsive web application that works
                great on mobile devices. A dedicated mobile app is in
                development.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
