
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

const NewDeploymentModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          New Deployment
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-700 text-white sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Deployment</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              placeholder="my-awesome-app"
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="repository">Repository URL</Label>
            <Input
              id="repository"
              placeholder="https://github.com/username/repo"
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="provider">Cloud Provider</Label>
              <Select>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="aws">🟠 AWS</SelectItem>
                  <SelectItem value="azure">🔵 Azure</SelectItem>
                  <SelectItem value="gcp">🔴 Google Cloud</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="region">Region</Label>
              <Select>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                  <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                  <SelectItem value="eu-west-1">Europe (Ireland)</SelectItem>
                  <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="environment">Environment</Label>
            <Select>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Select environment" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="production">Production</SelectItem>
                <SelectItem value="staging">Staging</SelectItem>
                <SelectItem value="development">Development</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="build-command">Build Command</Label>
            <Input
              id="build-command"
              placeholder="npm run build"
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="env-vars">Environment Variables</Label>
            <Textarea
              id="env-vars"
              placeholder="NODE_ENV=production&#10;API_URL=https://api.example.com"
              className="bg-gray-800 border-gray-600 text-white"
              rows={3}
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setOpen(false)} className="border-gray-600 text-gray-300">
            Cancel
          </Button>
          <Button 
            onClick={() => setOpen(false)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Deploy
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewDeploymentModal;
