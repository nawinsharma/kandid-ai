"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCreateLead } from "@/hooks/use-leads";
import { useCampaigns } from "@/hooks/use-campaigns";
import { Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreateLeadFormProps {
  trigger?: React.ReactNode;
  defaultCampaignId?: string;
}

export function CreateLeadForm({ trigger, defaultCampaignId }: CreateLeadFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    title: "",
    company: "",
    linkedinUrl: "",
    profileImage: "",
    campaignId: defaultCampaignId || "",
    status: "pending" as const,
    activity: 0,
  });

  const { toast } = useToast();
  const createLead = useCreateLead();
  const { data: campaigns } = useCampaigns();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.campaignId) {
      toast({
        title: "Error",
        description: "Name and campaign are required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createLead.mutateAsync(formData);
      toast({
        title: "Success",
        description: "Lead created successfully!",
      });
      setOpen(false);
      setFormData({
        name: "",
        email: "",
        title: "",
        company: "",
        linkedinUrl: "",
        profileImage: "",
        campaignId: defaultCampaignId || "",
        status: "pending",
        activity: 0,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to create lead. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Lead</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter lead's name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter email address"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter job title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => handleInputChange("company", e.target.value)}
              placeholder="Enter company name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
            <Input
              id="linkedinUrl"
              value={formData.linkedinUrl}
              onChange={(e) => handleInputChange("linkedinUrl", e.target.value)}
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profileImage">Profile Image URL</Label>
            <Input
              id="profileImage"
              value={formData.profileImage}
              onChange={(e) => handleInputChange("profileImage", e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
            />
          </div>

          {defaultCampaignId ? null : (
            <div className="space-y-2">
              <Label htmlFor="campaign">Campaign *</Label>
              <Select value={formData.campaignId} onValueChange={(value) => handleInputChange("campaignId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a campaign" />
                </SelectTrigger>
                <SelectContent>
                  {campaigns?.map((campaign: { id: string; name: string }) => (
                    <SelectItem key={campaign.id} value={campaign.id}>
                      {campaign.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="responded">Responded</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="activity">Activity Level (0-5)</Label>
            <Select value={formData.activity.toString()} onValueChange={(value) => handleInputChange("activity", parseInt(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0 - No Activity</SelectItem>
                <SelectItem value="1">1 - Low</SelectItem>
                <SelectItem value="2">2 - Below Average</SelectItem>
                <SelectItem value="3">3 - Average</SelectItem>
                <SelectItem value="4">4 - Above Average</SelectItem>
                <SelectItem value="5">5 - High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createLead.isPending}>
              {createLead.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Lead"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
