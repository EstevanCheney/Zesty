import { useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Upload, X, CheckCircle } from "lucide-react";

export function SubmitReportForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    
    // Reset form after 2 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setSelectedFile(null);
      setCategory("");
      setLocation("");
      setDescription("");
    }, 2000);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 h-full">
      <h3 className="text-slate-800 mb-4">Submit New Report</h3>
      
      {isSubmitted ? (
        <div className="flex flex-col items-center justify-center py-12">
          <CheckCircle className="w-16 h-16 text-[#2D5A27] mb-4" />
          <p className="text-lg text-slate-800 font-medium">Report Submitted!</p>
          <p className="text-sm text-slate-600 mt-2">Your maintenance request has been logged.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Photo Upload */}
          <div className="space-y-2">
            <Label className="text-slate-700">Photo Upload</Label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDragging
                  ? "border-[#2D5A27] bg-green-50"
                  : "border-slate-300 bg-slate-50"
              }`}
            >
              {selectedFile ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-[#2D5A27] rounded flex items-center justify-center">
                      <Upload className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm text-slate-700 truncate max-w-[200px]">
                      {selectedFile.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600 mb-1">
                    Drag & drop photo here, or click to browse
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="text-sm text-[#2D5A27] cursor-pointer hover:underline"
                  >
                    Browse files
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-slate-700">
              Category
            </Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger id="category" className="border-slate-300">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="safety">Safety</SelectItem>
                <SelectItem value="cleaning">Cleaning</SelectItem>
                <SelectItem value="repair">Repair</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-slate-700">
              Location
            </Label>
            <Select value={location} onValueChange={setLocation} required>
              <SelectTrigger id="location" className="border-slate-300">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="main-entrance">Main Entrance - Ticketing</SelectItem>
                <SelectItem value="small-farm">Small Farm</SelectItem>
                <SelectItem value="giraffe-habitat">Giraffe Habitat</SelectItem>
                <SelectItem value="food-kiosk-crepes">Food Kiosk - Crepes</SelectItem>
                <SelectItem value="african-savanna">African Savanna</SelectItem>
                <SelectItem value="big-aviary">Big Aviary</SelectItem>
                <SelectItem value="bactrian-camels">Bactrian Camels</SelectItem>
                <SelectItem value="arctic-area">Arctic Area - Polar Bears</SelectItem>
                <SelectItem value="little-amazonia">Little Amazonia</SelectItem>
                <SelectItem value="felines">Felines - Panthers & Leopards</SelectItem>
                <SelectItem value="lemurs">Lemurs & Primates</SelectItem>
                <SelectItem value="picnic-area">Picnic Area</SelectItem>
                <SelectItem value="toilets">Restrooms</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-700">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe the issue in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="border-slate-300 resize-none"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-[#2D5A27] hover:bg-[#1f3f1c] text-white"
          >
            Submit Report
          </Button>
        </form>
      )}
    </div>
  );
}