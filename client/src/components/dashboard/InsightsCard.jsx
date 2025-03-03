import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function InsightsCard({ 
  insights = [],
  title = "Insights",
  onAcknowledge = () => {},
  emptyMessage = "No insights to show"
}) {
  if (!insights.length) {
    return (
      <Card className="shadow-sm h-full">
        <CardHeader className="pb-2">
          <h3 className="font-medium">{title}</h3>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-8">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-2">
        <h3 className="font-medium">{title}</h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {insights.map((insight) => (
            <div key={insight.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                <div>
                  <p className="font-medium text-sm">{insight.title}</p>
                  <p className="text-xs text-gray-500">{insight.description}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-teal-500 border-teal-500 h-6 text-xs w-full sm:w-auto"
                  onClick={() => onAcknowledge && onAcknowledge(insight)}
                >
                  Acknowledge
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}