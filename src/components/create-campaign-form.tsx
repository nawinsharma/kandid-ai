"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCreateCampaign } from "@/hooks/use-campaigns";
import { Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreateCampaignFormProps {
  trigger?: React.ReactNode;
}

export function CreateCampaignForm({ trigger }: CreateCampaignFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "draft" as const,
    requestMessage: "",
    connectionMessage: "",
    followupMessages: [] as string[],
    settings: {
      autopilot: false,
      personalization: true,
      selectedAccounts: [] as string[],
    },
  });

  const { toast } = useToast();
  const createCampaign = useCreateCampaign();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast({
        title: "Error",
        description: "Campaign name is required.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createCampaign.mutateAsync(formData);
      toast({
        title: "Success",
        description: "Campaign created successfully!",
      });
      setOpen(false);
      setFormData({
        name: "",
        description: "",
        status: "draft",
        requestMessage: "",
        connectionMessage: "",
        followupMessages: [],
        settings: {
          autopilot: false,
          personalization: true,
          selectedAccounts: [],
        },
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field.startsWith('settings.')) {
      const settingField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          [settingField]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Campaign Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter campaign name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter campaign description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="requestMessage">Connection Request Message</Label>
            <Textarea
              id="requestMessage"
              value={formData.requestMessage}
              onChange={(e) => handleInputChange("requestMessage", e.target.value)}
              placeholder="Enter your connection request message"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="connectionMessage">Connection Message</Label>
            <Textarea
              id="connectionMessage"
              value={formData.connectionMessage}
              onChange={(e) => handleInputChange("connectionMessage", e.target.value)}
              placeholder="Enter your connection message"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Settings</Label>
            <div className="space-y-2 pl-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="autopilot"
                  checked={formData.settings.autopilot}
                  onChange={(e) => handleInputChange("settings.autopilot", e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="autopilot" className="text-sm">Enable Autopilot</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="personalization"
                  checked={formData.settings.personalization}
                  onChange={(e) => handleInputChange("settings.personalization", e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="personalization" className="text-sm">Enable Personalization</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createCampaign.isPending}>
              {createCampaign.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Campaign"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
