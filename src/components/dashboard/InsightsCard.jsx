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
      <CardHeader className="pb-4">
        <h3 className="font-medium">{title}</h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight) => (
            <div key={insight.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="space-y-1.5">
                  <p className="font-medium text-sm">{insight.title}</p>
                  <p className="text-xs text-gray-500">{insight.description}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-teal-500 border-teal-500 h-7 text-xs w-full sm:w-auto mt-2 sm:mt-0 shrink-0"
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