"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Brain,
  Cpu,
  Shield,
  Zap,
  Activity,
  Folder,
  Terminal,
  AlertCircle,
  CheckCircle,
  Play,
  FileText,
  Database,
  TrendingUp,
  Lock,
  Eye,
  Sparkles,
  Users,
  ArrowRight,
  Settings,
  RefreshCw,
  Info,
  UploadCloud,
  Copy,
  Check,
  Plus,
  Trash2,
  Tag,
  Globe,
  Clock,
  FileImage,
  ArrowLeft,
  MoreVertical,
  Search,
  Edit,
  Loader2
} from "lucide-react";
import { aiApi } from "@/lib/api";
import { showToast } from "@/lib/toast";

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">{children}</label>
);

const departmentsList = [
  { id: 1, key: "research", name: "Product Research AI", icon: Sparkles, desc: "Trend research, Competitor scanning, Demand validation.", assignee: "Sophia", role: "Lead Trend Analyst", avatar: "👩‍💻", focus: "Pinterest/Insta & Luxury Brands", metric: "Trend accuracy 94.8%" },
  { id: 2, key: "design", name: "Design Director AI", icon: Brain, desc: "Collection planning, Typography, Print placement blueprints.", assignee: "Marcus", role: "Head of Apparel Design", avatar: "👨‍🎨", focus: "Luxury layouts & cuts", metric: "Aesthetic index 9.8/10" },
  { id: 3, key: "identity", name: "Brand Identity AI", icon: Shield, desc: "Storytelling, Brand voice, Premium product names & philosophy.", assignee: "Aria", role: "Brand Storyteller", avatar: "👩‍🎨", focus: "Customer emotions & positioning", metric: "Positioning score 99%" },
  { id: 4, key: "inventory", name: "Inventory AI", icon: Folder, desc: "Production quantity planning, Restock forecast, Deadstock prevention.", assignee: "Kabir", role: "Logistics & Stock Manager", avatar: "👨&zwj;💼", focus: "Size ratio allocations", metric: "Waste reduction +24%" },
  { id: 5, key: "pricing", name: "Pricing AI", icon: DollarSignIcon, desc: "Margin calculation, Discount strategies, Launch markup analysis.", assignee: "Neha", role: "Financial Analyst", avatar: "👩&zwj;💼", focus: "Profit optimization", metric: "Gross margin 82.5%" },
  { id: 6, key: "marketing", name: "Marketing AI", icon: Zap, desc: "Campaign planning, Launch strategy, Whatsapp/Email viral funnels.", assignee: "Arjun", role: "D2C Launch Strategist", avatar: "👨&zwj;💻", focus: "Viral launch plans", metric: "Click rate +18.4%" },
  { id: 7, key: "social", name: "Social Media Manager AI", icon: Users, desc: "Caption copywriting, Instagram posting schedules, Community replies.", assignee: "Pooja", role: "Social Copywriter", avatar: "👩&zwj;💻", focus: "Visual aesthetics & storytelling", metric: "Engagement 5.2x" },
  { id: 8, key: "ads", name: "Performance Marketing AI", icon: Activity, desc: "Meta/Google Ads configuration, Pixel retargeting, Budget caps.", assignee: "Rohan", role: "Meta Ads Specialist", avatar: "👨&zwj;💻", focus: "ROAS scale strategy", metric: "ROAS target 4.2x" },
  { id: 9, key: "sales", name: "Sales AI", icon: TrendingUp, desc: "Conversion rate optimization, Cart upsells, Customer journeys.", assignee: "Zara", role: "Conversion Architect", avatar: "👩&zwj;💼", focus: "Web sales funnel optimization", metric: "Conv. rate +3.1%" },
];

function DollarSignIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

export default function AiSupportPage() {
  const [settings, setSettings] = useState<any>({
    KILL_CRITIC_MODE: false,
    EXPOSED_MODE: true,
    IQ_200: true,
    THINKING_10X: true,
    AUTOPSY_MODE: false,
    ZERO_ASSUMPTIONS: true,
    NO_SHORTCUTS: true,
    NO_PLACEHOLDER: true,
  });

  const [instruction, setInstruction] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTask, setActiveTask] = useState<any>(null);
  const [taskHistory, setTaskHistory] = useState<any[]>([]);
  const [memories, setMemories] = useState<any[]>([]);
  const [selectedMemoryCategory, setSelectedMemoryCategory] = useState("All");
  const [simulatedStepIndex, setSimulatedStepIndex] = useState(-1);
  const [simulatedLogs, setSimulatedLogs] = useState<string[]>([]);
  
  const [selectedPlanTab, setSelectedPlanTab] = useState("research");
  const [rejectionFeedback, setRejectionFeedback] = useState("");
  const [showRejectionInput, setShowRejectionInput] = useState(false);
  const [submittingDecision, setSubmittingDecision] = useState(false);

  const [showAddMemoryForm, setShowAddMemoryForm] = useState(false);
  const [newMemoryCategory, setNewMemoryCategory] = useState("Brand Guidelines");
  const [newMemoryContent, setNewMemoryContent] = useState("");
  const [newMemoryTags, setNewMemoryTags] = useState("");

  const [selectedDeptDetail, setSelectedDeptDetail] = useState<any>(null);
  
  const [activeModule, setActiveModule] = useState("os");
  
  const logEndRef = useRef<HTMLDivElement>(null);

  // AI Tags Generator Module States
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [tagsLoading, setTagsLoading] = useState(false);
  const [tagsLogs, setTagsLogs] = useState<string[]>([]);
  const [generatedMetadata, setGeneratedMetadata] = useState<any>(null);
  const [savedTagsHistory, setSavedTagsHistory] = useState<any[]>([]);
  const [trendingTags, setTrendingTags] = useState<any[]>([]);
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const tagsLogEndRef = useRef<HTMLDivElement>(null);

  // States for editing metadata
  const [editTitle, setEditTitle] = useState("");
  const [editCaption, setEditCaption] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editTags, setEditTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState("");
  const [isEditingExisting, setIsEditingExisting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "generate">("list");
  const [assetSearch, setAssetSearch] = useState("");

  // AI Settings Dialog Toggles
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [settingAutopsy, setSettingAutopsy] = useState(true);
  const [setting200Iq, setSetting200Iq] = useState(true);
  const [settingExposedLogs, setSettingExposedLogs] = useState(true);
  const [settingKillCritical, setSettingKillCritical] = useState(true);
  const [setting10ThinkPoints, setSetting10ThinkPoints] = useState(true);
  const [settingCustomPrompt, setSettingCustomPrompt] = useState("");

  const filteredAssets = savedTagsHistory.filter(item =>
    (item.title || "").toLowerCase().includes(assetSearch.toLowerCase()) ||
    (item.tags || []).some((t: string) => t.toLowerCase().includes(assetSearch.toLowerCase())) ||
    (item.hashtags || []).some((h: string) => h.toLowerCase().includes(assetSearch.toLowerCase())) ||
    (item.description || "").toLowerCase().includes(assetSearch.toLowerCase())
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSettingAutopsy(localStorage.getItem("ff_ai_autopsy") !== "false");
      setSetting200Iq(localStorage.getItem("ff_ai_200iq") !== "false");
      setSettingExposedLogs(localStorage.getItem("ff_ai_exposed") !== "false");
      setSettingKillCritical(localStorage.getItem("ff_ai_killcritical") !== "false");
      setSetting10ThinkPoints(localStorage.getItem("ff_ai_10think") !== "false");
      setSettingCustomPrompt(localStorage.getItem("ff_ai_customprompt") || "");
    }
  }, []);

  const handleSaveAiSettings = () => {
    localStorage.setItem("ff_ai_autopsy", String(settingAutopsy));
    localStorage.setItem("ff_ai_200iq", String(setting200Iq));
    localStorage.setItem("ff_ai_exposed", String(settingExposedLogs));
    localStorage.setItem("ff_ai_killcritical", String(settingKillCritical));
    localStorage.setItem("ff_ai_10think", String(setting10ThinkPoints));
    localStorage.setItem("ff_ai_customprompt", settingCustomPrompt);
    showToast.success("AI Generation tweaks saved successfully!");
    setShowSettingsDialog(false);
  };

  useEffect(() => {
    fetchSettings();
    fetchTasks();
    fetchMemory();
  }, []);

  useEffect(() => {
    if (activeModule === "tags-generator") {
      fetchTagsHistory();
      fetchTrendingTags();
    }
  }, [activeModule]);

  useEffect(() => {
    if (tagsLogEndRef.current) {
      tagsLogEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [tagsLogs]);

  const fetchTagsHistory = async () => {
    try {
      const data = await aiApi.getSavedTagHistory();
      setSavedTagsHistory(data);
    } catch (err) {
      console.error("Error fetching tags history:", err);
    }
  };

  const fetchTrendingTags = async () => {
    try {
      const data = await aiApi.getTrendingHashtags();
      setTrendingTags(data);
    } catch (err) {
      console.error("Error fetching trending tags:", err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setGeneratedMetadata(null);
      setTagsLogs([]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setGeneratedMetadata(null);
      setTagsLogs([]);
    }
  };

  const handleGenerateTags = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    try {
      setTagsLoading(true);
      setGeneratedMetadata(null);
      setTagsLogs(["[SYSTEM] Preparing file stream..."]);

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("autopsy", String(settingAutopsy));
      formData.append("iq", String(setting200Iq));
      formData.append("exposedLogs", String(settingExposedLogs));
      formData.append("killCritical", String(settingKillCritical));
      formData.append("thinkPoints", String(setting10ThinkPoints));
      formData.append("customPrompt", settingCustomPrompt);

      const response = await aiApi.generateTags(formData);
      
      const responseLogs = response.logs || [];
      setTagsLogs([]);
      for (let i = 0; i < responseLogs.length; i++) {
        await new Promise((res) => setTimeout(res, 100));
        setTagsLogs((prev) => [...prev, responseLogs[i]]);
      }

      if (response.error) {
        showToast.error(response.error);
        return;
      }

      setGeneratedMetadata(response);
      setEditTitle(response.title || "");
      setEditCaption(response.caption || "");
      setEditDescription(response.description || "");
      setEditTags(response.tags || []);
      setSelectedHashtags(response.hashtags || []);
      showToast.success("Aesthetic copy and tags generated!");
    } catch (err: any) {
      console.error(err);
      const serverError = err.response?.data?.error || err.message || String(err);
      const serverLogs = err.response?.data?.logs || [];
      
      if (serverLogs.length > 0) {
        setTagsLogs([]);
        for (let i = 0; i < serverLogs.length; i++) {
          await new Promise((res) => setTimeout(res, 100));
          setTagsLogs((prev) => [...prev, serverLogs[i]]);
        }
      } else {
        setTagsLogs((prev) => [...prev, `❌ [FATAL ERROR] Client Request Failed: ${serverError}`]);
      }
      
      showToast.error(serverError);
    } finally {
      setTagsLoading(false);
    }
  };

  const handleSaveFinalized = async () => {
    if (!generatedMetadata) return;
    try {
      setTagsLoading(true);
      const payload = {
        imageUrl: generatedMetadata.imageUrl,
        title: editTitle,
        caption: editCaption,
        description: editDescription,
        tags: editTags,
        hashtags: selectedHashtags
      };
      
      if (isEditingExisting && editingId) {
        await aiApi.updateFinalizedTags({ id: editingId, ...payload });
        showToast.success("Tags & copy updated in Neon database!");
      } else {
        await aiApi.saveFinalizedTags(payload);
        showToast.success("Tags & copy saved to Neon database!");
      }

      fetchTagsHistory();
      fetchTrendingTags();
      
      setGeneratedMetadata(null);
      setSelectedFile(null);
      setPreviewUrl(null);
      setIsEditingExisting(false);
      setEditingId(null);
    } catch (err: any) {
      console.error(err);
      showToast.error(isEditingExisting ? "Failed to update record." : "Failed to save to database.");
    } finally {
      setTagsLoading(false);
    }
  };

  const handleDeleteAsset = async (id: string) => {
    if (!confirm("Are you sure you want to delete this asset record from the database?")) return;
    try {
      setTagsLoading(true);
      await aiApi.deleteFinalizedTags(id);
      showToast.success("Asset deleted successfully!");
      fetchTagsHistory();
      fetchTrendingTags();
      
      if (editingId === id) {
        setGeneratedMetadata(null);
        setSelectedFile(null);
        setPreviewUrl(null);
        setIsEditingExisting(false);
        setEditingId(null);
      }
    } catch (err: any) {
      console.error(err);
      showToast.error("Failed to delete asset.");
    } finally {
      setTagsLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast.success(`Copied ${label} to clipboard!`);
  };

  const copyFullDossier = () => {
    const text = `TITLE: ${editTitle}\n\nDESCRIPTION:\n${editDescription}\n\nCAPTION:\n${editCaption}\n\nTAGS:\n${editTags.join(", ")}\n\nHASHTAGS:\n${selectedHashtags.map(h => `#${h}`).join(" ")}`;
    navigator.clipboard.writeText(text);
    showToast.success("Copied complete D2C Copywriting Dossier!");
  };

  const toggleHashtagSelection = (tag: string) => {
    if (selectedHashtags.includes(tag)) {
      setSelectedHashtags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedHashtags(prev => [...prev, tag]);
    }
  };

  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagInput.trim()) return;
    const cleanTag = newTagInput.trim().toLowerCase();
    if (!editTags.includes(cleanTag)) {
      setEditTags(prev => [...prev, cleanTag]);
    }
    setNewTagInput("");
  };

  const handleRemoveTag = (tag: string) => {
    setEditTags(prev => prev.filter(t => t !== tag));
  };

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [simulatedLogs]);

  const fetchSettings = async () => {
    try {
      const data = await aiApi.getSettings();
      setSettings(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTasks = async () => {
    try {
      const data = await aiApi.getTasks();
      setTaskHistory(data);
      if (data.length > 0 && !activeTask) {
        setActiveTask(data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMemory = async () => {
    try {
      const data = await aiApi.getMemory();
      setMemories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = async (key: string) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    try {
      await aiApi.saveSettings(updated);
      showToast.success(`${key.replace(/_/g, " ")} updated successfully`);
    } catch (err) {
      showToast.error("Failed to update AI settings", err);
    }
  };

  const executeSimulatedTask = async (task: any) => {
    setSimulatedStepIndex(0);
    setSimulatedLogs([]);
    
    const logs = task.logs || [];
    for (let i = 0; i < logs.length; i++) {
      await new Promise((res) => setTimeout(res, 500));
      setSimulatedStepIndex(i);
      setSimulatedLogs((prev) => [...prev, logs[i]]);
    }
    setSimulatedStepIndex(-1);
  };

  const handleSubmitInstruction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instruction.trim()) return;

    try {
      setLoading(true);
      const task = await aiApi.createTask(instruction);
      setActiveTask(task);
      setInstruction("");
      await fetchTasks();
      await fetchMemory(); // Memory might be updated on completed tasks
      await executeSimulatedTask(task);
    } catch (err) {
      showToast.error("Failed to deploy task", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTask = (task: any) => {
    setActiveTask(task);
    setSimulatedLogs(task.logs || []);
    setSimulatedStepIndex(-1);
  };

  const handleApprove = async () => {
    if (!activeTask) return;
    try {
      setSubmittingDecision(true);
      const updatedTask = await aiApi.approveTask(activeTask.id);
      setActiveTask(updatedTask);
      await fetchTasks();
      await fetchMemory();
      setSimulatedLogs(updatedTask.logs || []);
      showToast.success("Collection approved & executed successfully!");
    } catch (err) {
      showToast.error("Failed to approve task", err);
    } finally {
      setSubmittingDecision(false);
    }
  };

  const handleReject = async () => {
    if (!activeTask || !rejectionFeedback.trim()) return;
    try {
      setSubmittingDecision(true);
      const updatedTask = await aiApi.rejectTask(activeTask.id, rejectionFeedback);
      setActiveTask(updatedTask);
      await fetchTasks();
      setSimulatedLogs(updatedTask.logs || []);
      setShowRejectionInput(false);
      setRejectionFeedback("");
      showToast.success("Task rejected and revisions sent.");
    } catch (err) {
      showToast.error("Failed to reject task", err);
    } finally {
      setSubmittingDecision(false);
    }
  };

  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemoryContent.trim()) return;

    try {
      const tags = newMemoryTags.split(",").map((t) => t.trim()).filter(Boolean);
      await aiApi.addMemory(newMemoryCategory, newMemoryContent, tags);
      setNewMemoryContent("");
      setNewMemoryTags("");
      setShowAddMemoryForm(false);
      await fetchMemory();
      showToast.success("Memory card logged successfully!");
    } catch (err) {
      showToast.error("Failed to save memory card", err);
    }
  };

  const categories = ["All", ...Array.from(new Set(memories.map((m) => m.category)))];
  const filteredMemories = selectedMemoryCategory === "All" 
    ? memories 
    : memories.filter((m) => m.category === selectedMemoryCategory);

  return (
    <div className="space-y-8 pb-12 text-foreground">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-border/40 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="border-orange-500/20 bg-orange-500/5 text-orange-500 text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5">
              Fox Falcon OS v2.1
            </Badge>
            <Badge variant="outline" className="border-green-500/20 bg-green-500/5 text-green-500 text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 animate-pulse">
              HR Controller Online
            </Badge>
          </div>
          <h1 className="text-4xl font-black tracking-tighter flex items-center gap-3">
            <Cpu className="w-8 h-8 text-primary" /> AI OPERATING SYSTEM
          </h1>
          <p className="text-muted-foreground mt-1">
            Master Controller Panel for HR, Operations, and AI-First Streetwear Departments.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-2 font-bold gap-2 text-xs uppercase" onClick={() => { fetchSettings(); fetchTasks(); fetchMemory(); }}>
            <RefreshCw className="w-3.5 h-3.5" /> Sync Engines
          </Button>
        </div>
      </div>

      {/* Premium Breadcrumb / Module Switcher */}
      <nav className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-wider text-muted-foreground bg-muted/10 px-4 py-3 rounded-xl border border-border/40 w-fit select-none">
        <span className="text-muted-foreground/60">Fox Falcon OS</span>
        <span className="text-muted-foreground/30">/</span>
        {[
          { id: "os", label: "AI Operating System" },
          { id: "team", label: "AI Team (9 Departments)" },
          { id: "memory", label: "AI Memory System Database" },
          { id: "history", label: "CEO Task Execution History" },
          { id: "tags-generator", label: "AI Tags & Hashtags Generator" },
        ].map((mod, idx) => (
          <React.Fragment key={mod.id}>
            {idx > 0 && <span className="text-muted-foreground/20">/</span>}
            <button
              type="button"
              onClick={() => setActiveModule(mod.id)}
              className={`transition-all hover:text-primary cursor-pointer ${
                activeModule === mod.id
                  ? "text-primary border-b-2 border-primary pb-0.5"
                  : "text-muted-foreground/80"
              }`}
            >
              {mod.label}
            </button>
          </React.Fragment>
        ))}
      </nav>

      {/* CEO Terminal & Realtime Pipeline (Full Width) */}
      {activeModule === "os" && (
        <div className="space-y-6">
          {/* Instruction Terminal */}
          <Card className="p-6 border-border/80 bg-black/40 relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-black flex items-center gap-2 text-sm uppercase tracking-wider">
                <Terminal className="w-4 h-4 text-primary" /> CEO Instruction Input
              </h3>
              <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-[9px] font-mono">
                Direct Command Mode
              </Badge>
            </div>
            
            <form onSubmit={handleSubmitInstruction} className="space-y-4">
              <div className="relative">
                <textarea
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  placeholder="e.g. Launch a premium 380 GSM drop shoulder Rust hoodie collection named 'Falcon Reborn' with 200 items, price ₹9,999, target 3.8x ROAS"
                  className="w-full bg-black/60 border-2 border-border rounded-xl p-4 pr-14 font-bold text-sm min-h-[110px] focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/50 text-foreground placeholder-muted-foreground/60 resize-y"
                  disabled={loading}
                  rows={3}
                />
                <button
                  type="submit"
                  disabled={loading || !instruction.trim()}
                  className="absolute right-4 bottom-4 p-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/95 transition-all disabled:opacity-50 active-scale shadow-lg hover:shadow-primary/25 cursor-pointer"
                >
                  <Play className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[10px] text-muted-foreground bg-muted/20 p-3.5 rounded-xl border border-border/60">
                <span className="leading-relaxed">
                  <Info className="w-3.5 h-3.5 inline mr-1.5 text-primary align-middle" />
                  <strong>Execution Gate Warning:</strong> Fabric Details, Production Quantity, retail Price, and Target ROAS are mandatory variables. Missing elements will trigger an execution block.
                </span>
                <button
                  type="button"
                  onClick={() => setInstruction("Launch a premium 380 GSM drop shoulder Rust hoodie collection named 'Falcon Reborn' with 200 items, price ₹9,999, target 3.8x ROAS")}
                  className="text-primary hover:underline hover:text-primary/80 font-black uppercase tracking-wider text-[9px] bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-md shrink-0 transition-all select-none self-end sm:self-auto cursor-pointer"
                >
                  ✨ Fill Example Input
                </button>
              </div>
            </form>
          </Card>

          {/* Simulated Workspace Flow Logs */}
          <Card className="p-6 border-border/80 bg-black/90 font-mono text-xs text-green-400 overflow-hidden min-h-[320px] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-border/20 mb-4 text-muted-foreground">
                <span className="flex items-center gap-2"><Activity className="w-4 h-4 text-green-400" /> OS Pipeline Log Console</span>
                <span className="text-[10px] uppercase font-bold">
                  {simulatedStepIndex !== -1 ? "Running..." : "Idle"}
                </span>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {simulatedLogs.map((log, index) => {
                  const isError = log.includes("ERROR") || log.includes("blocked") || log.includes("❌");
                  const isSuccess = log.includes("SUCCESS") || log.includes("successfully") || log.includes("✅");
                  return (
                    <div 
                      key={index} 
                      className={`leading-relaxed border-l-2 pl-2 transition-all duration-300 ${
                        isError ? "border-red-500 text-red-400" : isSuccess ? "border-emerald-500 text-emerald-400" : "border-primary/40 text-green-400"
                      }`}
                    >
                      {log}
                    </div>
                  );
                })}
                {simulatedStepIndex !== -1 && (
                  <div className="flex items-center gap-1 text-green-500/80 animate-pulse">
                    <span className="w-1.5 h-3.5 bg-green-400 inline-block animate-caret" /> Processing...
                  </div>
                )}
                {simulatedLogs.length === 0 && (
                  <div className="text-muted-foreground text-center py-16">
                    Enter an instruction above or select a past task from history to trace execution flow.
                  </div>
                )}
                <div ref={logEndRef} />
              </div>
            </div>

            {/* Execution Gate Response Alert for Blocked States */}
            {activeTask && activeTask.status === "BLOCKED" && (
              <div className="mt-4 p-4 border border-red-500/40 bg-red-950/20 rounded-xl space-y-3 font-sans text-sm text-foreground">
                <div className="flex items-center gap-2 text-red-500 font-black uppercase tracking-wider text-xs">
                  <AlertCircle className="w-5 h-5" /> Execution Blocked
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <strong className="text-red-400">Missing Variables:</strong>
                    <ul className="list-disc pl-5 mt-1 text-muted-foreground space-y-1">
                      {activeTask.missingVariables?.map((v: string) => <li key={v}>{v}</li>)}
                    </ul>
                  </div>
                  <div>
                    <strong className="text-amber-400">Required Input From CEO:</strong>
                    <ul className="list-disc pl-5 mt-1 text-muted-foreground space-y-1">
                      {activeTask.requiredInputs?.map((inp: string) => <li key={inp}>{inp}</li>)}
                    </ul>
                  </div>
                  <div className="flex gap-4 pt-1 font-mono text-[10px] text-muted-foreground">
                    <span>Status: <strong className="text-red-500">WAITING FOR CEO INPUT</strong></span>
                    <span>Permission: <strong className="text-red-500">DENIED</strong></span>
                  </div>
                </div>
              </div>
            )}

            {/* PENDING APPROVAL BLOCK */}
            {activeTask && activeTask.status === "PENDING_APPROVAL" && simulatedStepIndex === -1 && (
              <div className="mt-4 p-5 border border-yellow-500/30 bg-yellow-950/5 rounded-xl space-y-5 font-sans text-foreground">
                <div className="flex justify-between items-center pb-2 border-b border-border/40">
                  <div className="flex items-center gap-2 text-yellow-500 font-black uppercase tracking-wider text-xs">
                    <Shield className="w-5 h-5 text-yellow-500 animate-pulse animate-duration-1000" /> CEO DECISION REQUIRED
                  </div>
                  <Badge className="bg-yellow-500/25 border-yellow-500/25 text-yellow-400 text-[10px] font-black uppercase px-2 py-0.5 animate-pulse">
                    Awaiting Approval
                  </Badge>
                </div>

                <div className="text-xs text-muted-foreground leading-relaxed">
                  Review the generated D2C department plans before confirming execution:
                </div>

                {/* Interactive Departments Plan Tabs */}
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-1.5 p-1 bg-muted/30 rounded-lg border border-border/40 max-h-[120px] overflow-y-auto">
                    {[
                      { key: "research", label: "Research" },
                      { key: "design", label: "Design" },
                      { key: "identity", label: "Identity" },
                      { key: "inventory", label: "Inventory" },
                      { key: "pricing", label: "Pricing" },
                      { key: "marketing", label: "Marketing" },
                      { key: "social", label: "Social Media" },
                      { key: "ads", label: "Ads" },
                      { key: "sales", label: "Sales UI" },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setSelectedPlanTab(tab.key)}
                        className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${
                          selectedPlanTab === tab.key
                            ? "bg-primary text-primary-foreground font-black scale-105"
                            : "bg-muted/10 text-muted-foreground hover:bg-muted/30"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-black/60 border border-border/60 text-xs leading-relaxed min-h-[80px] font-mono text-zinc-300">
                    <strong className="text-primary uppercase tracking-wider text-[10px] block mb-1">
                      {selectedPlanTab} AI Output:
                    </strong>
                    {activeTask.pendingPlans?.departments?.[selectedPlanTab]?.deliverables || activeTask.pendingPlans?.[selectedPlanTab] || "No output generated."}
                  </div>
                </div>

                {/* Audit and Decision Actions */}
                <div className="pt-2 border-t border-border/40 space-y-4">
                  {showRejectionInput ? (
                    <div className="space-y-2">
                      <Label>Provide Critique / Revision Feedback</Label>
                      <textarea
                        value={rejectionFeedback}
                        onChange={(e) => setRejectionFeedback(e.target.value)}
                        placeholder="Explain what needs to be revised (e.g. increase pricing margin, adjust lookalike audience targeting, change color codes)..."
                        className="w-full bg-black/60 border border-border rounded-lg p-3 text-xs focus:outline-none focus:ring-1 focus:ring-red-500/40 text-foreground"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={handleReject}
                          disabled={submittingDecision || !rejectionFeedback.trim()}
                          className="font-bold text-xs uppercase"
                        >
                          Confirm Rejection
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setShowRejectionInput(false)}
                          className="font-bold text-xs uppercase"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        onClick={handleApprove}
                        disabled={submittingDecision}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase flex-1 h-10 tracking-widest"
                      >
                        {submittingDecision ? "Executing..." : "✅ Approve & Execute Collection"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowRejectionInput(true)}
                        disabled={submittingDecision}
                        className="border-red-500/30 text-red-400 hover:bg-red-950/20 font-bold text-xs uppercase h-10 tracking-widest shrink-0"
                      >
                        ❌ Reject & Revise
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CEO Report Card for Completed State */}
            {activeTask && activeTask.status === "COMPLETED" && simulatedStepIndex === -1 && (
              <div className="mt-4 p-5 border border-primary/20 bg-primary/[0.01] rounded-xl space-y-4 font-sans text-foreground">
                <div className="flex justify-between items-center pb-2 border-b border-border/40">
                  <div className="flex items-center gap-2 text-primary font-black uppercase tracking-wider text-xs">
                    <CheckCircle className="w-5 h-5 text-emerald-500" /> CEO Executive Report
                  </div>
                  <Badge className="bg-emerald-500/25 border-emerald-500/25 text-emerald-400 text-[10px] font-black uppercase px-2 py-0.5">
                    Executed
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Today's Mission</span>
                      <p className="font-bold mt-0.5">{activeTask.report?.mission}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Revenue Impact</span>
                      <p className="font-bold text-emerald-500 mt-0.5">{activeTask.report?.revenueImpact}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Department Status</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {Object.entries(activeTask.report?.departments || {}).map(([dept, status]: any) => (
                          <Badge key={dept} variant="outline" className="text-[9px] uppercase border-emerald-500/10 text-emerald-400 bg-emerald-500/5 font-black">
                            {dept}: {status}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 border-t md:border-t-0 md:border-l border-border/40 md:pl-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Risk Analysis</span>
                      <p className="text-muted-foreground leading-normal mt-0.5">{activeTask.report?.riskAnalysis}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Final Recommendation</span>
                      <p className="text-muted-foreground leading-normal mt-0.5 font-semibold text-primary">{activeTask.report?.recommendation}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Section: AI Departments */}
      {activeModule === "team" && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-black uppercase tracking-wider text-foreground">Fox Falcon AI Team (9 Departments)</h2>
            <p className="text-xs text-muted-foreground">Review functional metrics and roles overseen by HR AI.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {departmentsList.map((dept) => {
              const IconComponent = dept.icon;
              
              let deptStatus = "Online";
              if (activeTask) {
                if (activeTask.status === "COMPLETED") deptStatus = "Executed";
                else if (activeTask.status === "PENDING_APPROVAL") deptStatus = "Ready to Review";
                else if (activeTask.status === "BLOCKED") deptStatus = "Awaiting Info";
              }

              const activePlanDept = activeTask?.pendingPlans?.departments?.[dept.key];
              const displayAvatar = activePlanDept?.assistantAvatar || dept.avatar;
              const displayAssigneeName = activePlanDept?.assistantName || dept.assignee;
              const displayAssigneeRole = activePlanDept?.assistantRole || dept.role;

              return (
                <Card 
                  key={dept.id} 
                  onClick={() => setSelectedDeptDetail(dept)}
                  className="p-5 border-border bg-card hover:border-primary/60 transition-all duration-300 group cursor-pointer hover:scale-[1.02] shadow-lg active-scale select-none"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <Badge variant="outline" className={`text-[9px] font-black uppercase tracking-widest ${
                      deptStatus === "Online" ? "border-emerald-500/20 text-emerald-500 bg-green-500/5" :
                      deptStatus === "Executed" ? "border-emerald-500 text-emerald-400 bg-emerald-500/10" :
                      deptStatus === "Ready to Review" ? "border-yellow-500 text-yellow-400 bg-yellow-500/10 animate-pulse" :
                      "border-red-500 text-red-400 bg-red-500/10"
                    }`}>
                      {deptStatus}
                    </Badge>
                  </div>
                  <h4 className="font-bold text-sm tracking-tight text-foreground uppercase">{dept.name}</h4>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{dept.desc}</p>
                  
                  <div className="mt-3 text-[10px] text-muted-foreground flex items-center gap-1.5 bg-muted/40 p-2 rounded-lg border border-border/40 w-fit">
                    <span>{displayAvatar} Assignee:</span>
                    <strong className="text-foreground">{displayAssigneeName} ({displayAssigneeRole.split(" ")[0]})</strong>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/40 flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    <span>Focus: <strong className="text-foreground">{dept.focus}</strong></span>
                    <span className="text-primary font-black">{dept.metric}</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Section: AI Memory System Explorer */}
      {activeModule === "memory" && (
        <div className="space-y-4 pt-4">
          <div>
            <h2 className="text-xl font-black uppercase tracking-wider text-foreground">AI Memory System Database</h2>
            <p className="text-xs text-muted-foreground">Browse persistent brand guidelines, mistakes, color palettes, and assets to prevent repeating errors.</p>
          </div>

          <Card className="p-6 border-border bg-card">
            <div className="flex justify-between items-center pb-4 border-b border-border/40 mb-6">
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedMemoryCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                      selectedMemoryCategory === cat
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddMemoryForm(!showAddMemoryForm)}
                className="text-[10px] font-black uppercase border-2 h-8"
              >
                {showAddMemoryForm ? "Cancel Form" : "✨ Create Memory Card"}
              </Button>
            </div>

            {showAddMemoryForm && (
              <form onSubmit={handleAddMemory} className="mb-6 p-4 rounded-xl bg-muted/20 border border-border/60 space-y-4 font-sans">
                <h4 className="font-bold text-xs uppercase tracking-wider text-primary">Add Brand Memory / Rule</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Category *</label>
                    <select
                      value={newMemoryCategory}
                      onChange={(e) => setNewMemoryCategory(e.target.value)}
                      className="w-full h-9 rounded-lg border border-border bg-black px-3 text-xs focus:outline-none text-foreground"
                    >
                      <option value="Brand Guidelines">Brand Guidelines</option>
                      <option value="Mistakes">Mistakes</option>
                      <option value="Lessons learned">Lessons learned</option>
                      <option value="Color palette">Color palette</option>
                      <option value="Typography">Typography</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Tags (comma separated)</label>
                    <Input
                      placeholder="e.g. design, aesthetics, logo"
                      value={newMemoryTags}
                      onChange={(e) => setNewMemoryTags(e.target.value)}
                      className="bg-black border-border h-9 text-xs"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Memory Content *</label>
                  <textarea
                    value={newMemoryContent}
                    onChange={(e) => setNewMemoryContent(e.target.value)}
                    placeholder="e.g. approved Falcon Typography weights are Black 900 for banners, and Inter 400 for subtext..."
                    className="w-full bg-black border border-border rounded-lg p-3 text-xs focus:outline-none text-foreground"
                    rows={3}
                    required
                  />
                </div>
                <Button type="submit" size="sm" className="font-bold text-xs uppercase h-8 px-4 bg-primary text-primary-foreground">
                  Save Memory Card
                </Button>
              </form>
            )}

            <div className="space-y-4">
              {filteredMemories.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-xs font-bold">
                  No memories logged for this category.
                </div>
              ) : (
                filteredMemories.map((mem) => (
                  <div 
                    key={mem.id} 
                    className="p-4 rounded-xl bg-muted/10 border border-border/60 hover:border-primary/20 transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-primary/10 border-primary/20 text-primary text-[9px] uppercase tracking-wider font-black">
                          {mem.category}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">{new Date(mem.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-foreground font-semibold leading-relaxed pt-1">{mem.content}</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {mem.tags?.map((t: string) => (
                        <Badge key={t} variant="outline" className="text-[9px] font-bold uppercase tracking-wider border-border/80 text-muted-foreground">
                          #{t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Task Execution History */}
      {activeModule === "history" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
          <Card className="lg:col-span-3 p-6 border-border bg-card">
            <h3 className="font-black flex items-center gap-2 mb-6 text-sm uppercase tracking-wider">
              <FileText className="w-4 h-4 text-primary" /> CEO Task Execution History
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border/60 text-muted-foreground uppercase font-black tracking-wider text-[10px]">
                    <th className="py-3 px-4">Task ID</th>
                    <th className="py-3 px-4">Instruction</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Created At</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {taskHistory.map((task) => (
                    <tr 
                      key={task.id} 
                      className={`border-b border-border/30 hover:bg-muted/20 transition-all ${
                        activeTask?.id === task.id ? "bg-primary/[0.02]" : ""
                      }`}
                    >
                      <td className="py-4 px-4 font-mono font-bold text-muted-foreground">{task.id}</td>
                      <td className="py-4 px-4 font-semibold max-w-xs truncate">{task.instruction}</td>
                      <td className="py-4 px-4">
                        <Badge 
                          variant="outline" 
                          className={`text-[9px] font-black uppercase px-2.5 py-0.5 tracking-wider ${
                            task.status === "COMPLETED" 
                              ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" 
                              : "border-red-500/20 bg-red-500/5 text-red-400"
                          }`}
                        >
                          {task.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground font-mono text-[10px]">
                        {new Date(task.createdAt).toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-[10px] font-black uppercase border-2 h-8 active-scale" 
                          onClick={() => handleSelectTask(task)}
                        >
                          Load Log
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {taskHistory.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-muted-foreground font-bold">
                        No tasks executed yet. Send your first instruction above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* AI Tags & Hashtags Generator Module */}
      {activeModule === "tags-generator" && (
        <div className="space-y-8 animate-fade-in text-foreground">
          {viewMode === "list" ? (
            <div className="space-y-6">
              {/* Header inside switcher */}
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-black tracking-tighter uppercase">AI Assets Registry</h2>
                  <p className="text-xs text-muted-foreground mt-1">Manage, copy, audit, and trace generated aesthetic visual tags and social copywriting.</p>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowSettingsDialog(true)}
                    variant="outline"
                    className="border-2 font-black h-11 px-4 text-xs uppercase cursor-pointer flex items-center"
                  >
                    <Settings className="w-4 h-4 mr-2" /> AI Tweaks
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      setGeneratedMetadata(null);
                      setTagsLogs([]);
                      setIsEditingExisting(false);
                      setEditingId(null);
                      setViewMode("generate");
                    }}
                    className="bg-primary hover:bg-primary/90 font-bold group h-11 px-5 text-xs uppercase cursor-pointer"
                  >
                    <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" /> Generate New Asset
                  </Button>
                </div>
              </div>

              {/* Filter and Search */}
              <Card className="p-6 border-border bg-card">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                  <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                    Directory Database: <span className="text-foreground">{savedTagsHistory.length} assets registered</span>
                  </div>
                  <div className="relative flex-1 max-w-md w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search assets by title, tags, hashtags..."
                      className="pl-10 bg-muted/30 border-border text-xs text-foreground"
                      value={assetSearch}
                      onChange={(e) => setAssetSearch(e.target.value)}
                    />
                  </div>
                </div>

                {tagsLoading && savedTagsHistory.length === 0 ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-4 text-muted-foreground">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    <span className="font-bold">Syncing registry directory...</span>
                  </div>
                ) : filteredAssets.length === 0 ? (
                  <div className="py-20 text-center space-y-4">
                    <FileImage className="w-16 h-16 text-muted-foreground mx-auto animate-pulse" />
                    <p className="text-muted-foreground font-medium text-xs">
                      {assetSearch ? "No registered assets match your search." : "AI Assets registry is empty. Generate your first tagged asset above!"}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-border/80 bg-black/20">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-border bg-muted/10 text-muted-foreground uppercase font-black tracking-wider text-[10px]">
                          <th className="py-3.5 px-4 w-[80px]">Image</th>
                          <th className="py-3.5 px-4">Asset Details</th>
                          <th className="py-3.5 px-4">Aesthetic Tags</th>
                          <th className="py-3.5 px-4">Social Hashtags</th>
                          <th className="py-3.5 px-4">Copywriting Preview</th>
                          <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAssets.map((item) => (
                          <tr key={item.id} className="border-b border-border/40 hover:bg-muted/10 transition-colors group">
                            <td className="py-3 px-4">
                              <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-border/60 bg-black">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover animate-fade-in" />
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="space-y-0.5">
                                <span className="font-bold text-foreground block text-sm">{item.title}</span>
                                <span className="text-[9px] text-muted-foreground block">{new Date(item.createdAt).toLocaleString()}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 max-w-[180px]">
                              <div className="flex flex-wrap gap-1">
                                {item.tags.slice(0, 3).map((tag: string) => (
                                  <Badge key={tag} variant="outline" className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground border-border bg-muted/10 py-0 px-1.5">
                                    {tag}
                                  </Badge>
                                ))}
                                {item.tags.length > 3 && (
                                  <span className="text-[8px] text-muted-foreground font-bold align-middle pt-0.5">+{item.tags.length - 3}</span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4 max-w-[180px]">
                              <div className="flex flex-wrap gap-1">
                                {item.hashtags.slice(0, 3).map((tag: string) => (
                                  <span key={tag} className="text-[9px] font-black uppercase text-orange-500" style={{ textTransform: "none" }}>
                                    #{tag}
                                  </span>
                                ))}
                                {item.hashtags.length > 3 && (
                                  <span className="text-[9px] text-muted-foreground font-bold">+{item.hashtags.length - 3}</span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4 max-w-xs">
                              <div className="space-y-1">
                                <p className="text-[10px] text-zinc-300 line-clamp-1 leading-normal italic">"{item.description}"</p>
                                <p className="text-[9px] text-muted-foreground line-clamp-1 font-mono">{item.caption}</p>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted"><MoreVertical className="w-4 h-4 text-muted-foreground" /></Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-background border-border font-sans">
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setGeneratedMetadata(item);
                                      setEditTitle(item.title);
                                      setEditCaption(item.caption);
                                      setEditDescription(item.description);
                                      setEditTags(item.tags);
                                      setSelectedHashtags(item.hashtags);
                                      setPreviewUrl(item.imageUrl);
                                      setSelectedFile(null);
                                      setIsEditingExisting(true);
                                      setEditingId(item.id);
                                      setViewMode("generate");
                                      showToast.success("Loaded card parameters into workspace!");
                                    }}
                                    className="font-bold cursor-pointer text-xs flex items-center"
                                  >
                                    <Edit className="w-3.5 h-3.5 mr-2 text-primary" /> Reload & Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      const text = `TITLE: ${item.title}\n\nDESCRIPTION:\n${item.description}\n\nCAPTION:\n${item.caption}\n\nTAGS:\n${item.tags.join(", ")}\n\nHASHTAGS:\n${item.hashtags.map((h: string) => `#${h}`).join(" ")}`;
                                      navigator.clipboard.writeText(text);
                                      showToast.success("Copied dossier copy to clipboard!");
                                    }}
                                    className="font-bold cursor-pointer text-xs flex items-center"
                                  >
                                    <Copy className="w-3.5 h-3.5 mr-2" /> Copy Dossier Copy
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteAsset(item.id)}
                                    className="font-bold text-destructive cursor-pointer text-xs flex items-center"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete Asset
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header with Back button */}
              <div className="flex items-center gap-4 border-b border-border/40 pb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setViewMode("list");
                    setIsEditingExisting(false);
                    setEditingId(null);
                    setGeneratedMetadata(null);
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="border-2 font-black uppercase text-[10px] tracking-wider h-8 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Registry
                </Button>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight">
                    {isEditingExisting ? "Edit Saved Asset" : "Aesthetic Tag Generator Workspace"}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {isEditingExisting ? `Modifying saved record metadata values.` : "Upload flat lay garments to analyze colors and retrieve social copy."}
                  </p>
                </div>
              </div>

              {/* Visual uploader and sandbox forms */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Uploader and Console Log Column (Left 1/3) */}
                <div className="lg:col-span-1 space-y-6">
                  <Card className="p-6 border-border bg-black/40 backdrop-blur-md">
                    <h3 className="font-black flex items-center gap-2 text-sm uppercase tracking-wider mb-4">
                      <UploadCloud className="w-4 h-4 text-primary" /> Image Source Uploader
                    </h3>
                    
                    <div 
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      className="border-2 border-dashed border-border/80 rounded-2xl p-6 text-center hover:border-primary/60 transition-all cursor-pointer relative bg-black/20 group"
                    >
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        disabled={tagsLoading || isEditingExisting}
                      />
                      {previewUrl ? (
                        <div className="space-y-4">
                          <div className="relative aspect-square w-full max-w-[200px] mx-auto rounded-xl overflow-hidden border border-border shadow-lg">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={previewUrl} alt="Preview" className="object-cover w-full h-full" />
                          </div>
                          <p className="text-[10px] text-muted-foreground font-mono truncate">{selectedFile?.name || "Loaded Asset Image Preview"}</p>
                          {!isEditingExisting && (
                            <Button variant="outline" size="sm" className="text-[9px] font-black uppercase tracking-wider h-7">
                              Change Image
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="py-8 space-y-3">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary group-hover:scale-110 transition-all duration-300">
                            <UploadCloud className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-foreground">Drag & Drop product photo here</p>
                            <p className="text-[10px] text-muted-foreground mt-1">or click to browse local files</p>
                          </div>
                          <Badge variant="outline" className="border-border text-[8px] font-bold uppercase text-muted-foreground tracking-widest px-2 py-0.5">
                            JPEG, PNG, WEBP max 4.5MB
                          </Badge>
                        </div>
                      )}
                    </div>

                    {selectedFile && !generatedMetadata && (
                      <Button 
                        onClick={handleGenerateTags} 
                        disabled={tagsLoading}
                        className="w-full mt-4 bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest h-10 active-scale"
                      >
                        {tagsLoading ? "Extracting Features..." : "✨ Run AI Tag Generation"}
                      </Button>
                    )}
                  </Card>

                  {/* Console Logs / Exposed Mode Terminal */}
                  <Card className="p-6 border-border bg-black/90 font-mono text-[11px] text-green-400 min-h-[220px] flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center pb-2 border-b border-border/20 mb-3 text-muted-foreground text-[10px] font-bold uppercase">
                        <span className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5 text-green-400" /> Pipeline Console</span>
                        <Badge variant="outline" className="border-green-500/20 bg-green-500/5 text-green-400 text-[8px] px-1.5 py-0">Exposed Mode</Badge>
                      </div>
                      <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1.5 custom-scrollbar">
                        {tagsLogs.map((log, index) => (
                          <div 
                            key={index} 
                            className={`leading-normal border-l-2 pl-1.5 ${
                              log.includes("ERROR") || log.includes("❌") ? "border-red-500 text-red-400" :
                              log.includes("SUCCESS") || log.includes("✅") ? "border-emerald-500 text-emerald-400" : "border-primary/30 text-green-400"
                            }`}
                          >
                            {log}
                          </div>
                        ))}
                        {tagsLoading && (
                          <div className="text-green-500/80 animate-pulse flex items-center gap-1">
                            <span className="w-1.5 h-3 bg-green-400 inline-block animate-caret" /> Analyzing image pixels...
                          </div>
                        )}
                        {tagsLogs.length === 0 && (
                          <div className="text-muted-foreground text-center py-10">
                            {isEditingExisting ? "Loaded historical tags console logs." : "Upload an image and hit generate to trace execution logs."}
                          </div>
                        )}
                        <div ref={tagsLogEndRef} />
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Generated Deliverables Workspace (Right 2/3) */}
                <div className="lg:col-span-2 space-y-6">
                  {generatedMetadata ? (
                    <div className="space-y-6 animate-fade-in">
                      
                      {/* Copywriting & Title Card */}
                      <Card className="p-6 border-border bg-card font-sans">
                        <div className="flex justify-between items-center pb-3 border-b border-border/40 mb-4">
                          <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-primary" /> Generated Marketing Copy
                          </h3>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={copyFullDossier}
                              className="text-[10px] font-black uppercase border-2 h-8 px-3 gap-1.5"
                            >
                              <Copy className="w-3.5 h-3.5" /> Copy Full Dossier
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {/* Title */}
                          <div className="space-y-1">
                            <div className="flex justify-between items-center">
                              <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Product Title</label>
                              <button 
                                onClick={() => copyToClipboard(editTitle, "Title")}
                                className="text-primary hover:underline text-[9px] font-bold uppercase"
                              >
                                Copy Title
                              </button>
                            </div>
                            <Input 
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="bg-black/40 border-border text-sm font-bold text-foreground"
                            />
                          </div>

                          {/* Description */}
                          <div className="space-y-1">
                            <div className="flex justify-between items-center">
                              <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Product E-Commerce Description</label>
                              <button 
                                onClick={() => copyToClipboard(editDescription, "Description")}
                                className="text-primary hover:underline text-[9px] font-bold uppercase"
                              >
                                Copy Desc
                              </button>
                            </div>
                            <textarea 
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                              className="w-full bg-black/40 border border-border rounded-lg p-3 text-xs leading-relaxed text-foreground min-h-[70px] focus:outline-none focus:ring-1 focus:ring-primary/40"
                              rows={2}
                            />
                          </div>

                          {/* Caption */}
                          <div className="space-y-1">
                            <div className="flex justify-between items-center">
                              <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Instagram / TikTok Caption</label>
                              <button 
                                onClick={() => copyToClipboard(editCaption, "Caption")}
                                className="text-primary hover:underline text-[9px] font-bold uppercase"
                              >
                                Copy Caption
                              </button>
                            </div>
                            <textarea 
                              value={editCaption}
                              onChange={(e) => setEditCaption(e.target.value)}
                              className="w-full bg-black/40 border border-border rounded-lg p-3 text-xs font-mono leading-relaxed text-foreground min-h-[110px] focus:outline-none focus:ring-1 focus:ring-primary/40"
                              rows={4}
                            />
                          </div>
                        </div>
                      </Card>

                      {/* Aesthetic Tags & Trending Hashtags Dashboard */}
                      <Card className="p-6 border-border bg-card">
                        <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-2 mb-4 border-b border-border/40 pb-3">
                          <Tag className="w-4 h-4 text-primary" /> Image Tagging & Hashtag Dashboard
                        </h3>

                        <div className="space-y-5">
                          {/* Product Tags */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">Product Design Tags ({editTags.length})</label>
                              <button 
                                onClick={() => copyToClipboard(editTags.join(", "), "Tags")}
                                className="text-primary hover:underline text-[9px] font-bold uppercase"
                              >
                                Copy Tags CSV
                              </button>
                            </div>
                            
                            <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-black/40 border border-border min-h-[50px]">
                              {editTags.map((tag) => (
                                <Badge 
                                  key={tag} 
                                  variant="outline" 
                                  className="text-[9px] font-bold uppercase tracking-wider border-border/80 text-foreground bg-muted/20 px-2 py-0.5 flex items-center gap-1.5"
                                >
                                  {tag}
                                  <button 
                                    onClick={() => handleRemoveTag(tag)}
                                    className="text-muted-foreground hover:text-red-500 font-bold ml-0.5 text-[8px]"
                                  >
                                    ✕
                                  </button>
                                </Badge>
                              ))}
                              {editTags.length === 0 && (
                                <span className="text-[10px] text-muted-foreground italic">No tags added yet.</span>
                              )}
                            </div>

                            {/* Custom tag input form */}
                            <form onSubmit={handleAddCustomTag} className="flex gap-2 mt-2">
                              <Input 
                                placeholder="Add custom design tag..." 
                                value={newTagInput}
                                onChange={(e) => setNewTagInput(e.target.value)}
                                className="bg-black/30 border-border h-8 text-xs max-w-[200px] text-foreground"
                              />
                              <Button type="submit" size="sm" variant="outline" className="h-8 border-2 font-bold text-[10px] uppercase">
                                <Plus className="w-3.5 h-3.5 mr-1" /> Add
                              </Button>
                            </form>
                          </div>

                          {/* Hashtags Selection Mixer */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">Active Output Hashtags ({selectedHashtags.length})</label>
                              <button 
                                onClick={() => copyToClipboard(selectedHashtags.map(h => `#${h}`).join(" "), "Hashtags")}
                                className="text-primary hover:underline text-[9px] font-bold uppercase"
                              >
                                Copy Raw Hashtags
                              </button>
                            </div>

                            <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-black/40 border border-border min-h-[50px]">
                              {selectedHashtags.map((ht) => (
                                <button
                                  key={ht}
                                  onClick={() => toggleHashtagSelection(ht)}
                                  className="text-[9px] font-black uppercase tracking-wider border border-orange-500/30 text-orange-500 bg-orange-500/5 px-2.5 py-0.5 rounded-lg flex items-center gap-1.5 hover:bg-orange-500/10 cursor-pointer select-none"
                                >
                                  #{ht}
                                  <span className="text-[8px] opacity-75 font-bold">✕</span>
                                </button>
                              ))}
                              {selectedHashtags.length === 0 && (
                                <span className="text-[10px] text-muted-foreground italic">Select tags below to populate output.</span>
                              )}
                            </div>
                          </div>

                          {/* Trending Streetwear Hashtags Bank */}
                          <div className="space-y-2 pt-2 border-t border-border/40">
                            <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                              <Globe className="w-3.5 h-3.5 text-primary inline mr-1" /> Hot Streetwear Hashtags (Click to toggle)
                            </label>
                            <div className="flex flex-wrap gap-1.5 p-1 max-h-[140px] overflow-y-auto custom-scrollbar">
                              {trendingTags.map((t) => {
                                const isSelected = selectedHashtags.includes(t.tag);
                                return (
                                  <button
                                    key={t.id || t.tag}
                                    onClick={() => toggleHashtagSelection(t.tag)}
                                    className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-md transition-all border flex items-center gap-1 cursor-pointer select-none ${
                                      isSelected 
                                        ? "bg-primary border-primary text-primary-foreground font-black scale-105" 
                                        : "bg-muted/10 border-border text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                                    }`}
                                  >
                                    #{t.tag}
                                    <span className="text-[8px] opacity-60">({t.popularity})</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                        </div>

                        {/* Submit Actions */}
                        <div className="mt-6 pt-5 border-t border-border/40 flex flex-col sm:flex-row gap-3">
                          <Button 
                            onClick={async () => {
                              await handleSaveFinalized();
                              setViewMode("list");
                            }}
                            disabled={tagsLoading}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-widest h-11 flex-1 active-scale shadow-lg hover:shadow-emerald-500/20"
                          >
                            {isEditingExisting ? "💾 Update Database Record" : "💾 Confirm & Save to Neon Database"}
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => {
                              setGeneratedMetadata(null);
                              setSelectedFile(null);
                              setPreviewUrl(null);
                              setIsEditingExisting(false);
                              setEditingId(null);
                              setViewMode("list");
                            }}
                            disabled={tagsLoading}
                            className="border-red-500/30 text-red-400 hover:bg-red-950/20 font-black text-xs uppercase tracking-widest h-11 px-6 active-scale cursor-pointer"
                          >
                            {isEditingExisting ? "Cancel Edit" : "Cancel & Return"}
                          </Button>
                        </div>

                      </Card>
                    </div>
                  ) : (
                    <Card className="p-12 border-border bg-card flex flex-col justify-center items-center text-center h-full min-h-[380px]">
                      <div className="w-16 h-16 rounded-full bg-muted/40 border border-border flex items-center justify-center text-muted-foreground/60 mb-4 animate-bounce">
                        <FileImage className="w-8 h-8" />
                      </div>
                      <h4 className="font-black text-sm uppercase tracking-wider">Aesthetic Metadata Builder Workspace</h4>
                      <p className="text-xs text-muted-foreground mt-2 max-w-sm leading-relaxed">
                        Upload a high-resolution flat lay or lookbook photo on the left. The Google Gemini model will extract details, build e-commerce copy, and fetch real-time hashtags.
                      </p>
                    </Card>
                  )}
                </div>

              </div>
            </div>
          )}
        </div>
      )}

      {/* Department Detail Modal */}
      <Dialog open={!!selectedDeptDetail} onOpenChange={(open) => !open && setSelectedDeptDetail(null)}>
        <DialogContent className="bg-background border-border sm:max-w-[550px] font-sans text-foreground">
          {selectedDeptDetail && (() => {
            const IconComp = selectedDeptDetail.icon;
            
            // Get active task's plans if available
            let deliverables = "";
            let taskStatusText = "No active task running.";
            
            const activePlanDept = activeTask?.pendingPlans?.departments?.[selectedDeptDetail.key];
            const displayAvatar = activePlanDept?.assistantAvatar || selectedDeptDetail.avatar;
            const displayAssigneeName = activePlanDept?.assistantName || selectedDeptDetail.assignee;
            const displayAssigneeRole = activePlanDept?.assistantRole || selectedDeptDetail.role;

            if (activeTask) {
              deliverables = activePlanDept?.deliverables || activeTask.pendingPlans?.[selectedDeptDetail.key] || "";
              taskStatusText = `Task: ${activeTask.extractedVariables?.name || 'Streetwear collection'} (${activeTask.status})`;
            }

            return (
              <>
                <DialogHeader className="border-b border-border/40 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <div>
                      <DialogTitle className="text-lg font-black uppercase tracking-wider">
                        {selectedDeptDetail.name} Dossier
                      </DialogTitle>
                      <DialogDescription className="text-xs text-muted-foreground">
                        {taskStatusText}
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-5 py-4">
                  {/* Assignee Profile Card */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/20 border border-border/60">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl select-none">
                      {displayAvatar}
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block leading-none">
                        Active Assignee
                      </span>
                      <strong className="text-sm font-black text-foreground block">
                        {displayAssigneeName}
                      </strong>
                      <span className="text-xs text-primary font-bold block">
                        {displayAssigneeRole}
                      </span>
                    </div>
                    <Badge className="ml-auto bg-green-500/20 text-green-400 border-none font-bold uppercase tracking-widest text-[9px]">
                      Online
                    </Badge>
                  </div>

                  {/* Deliverables / Research details */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary block">
                      📝 Live Research & Deliverables
                    </label>
                    <div className="p-4 rounded-xl bg-black/60 border border-border/60 text-xs font-mono leading-relaxed text-zinc-300 whitespace-pre-wrap min-h-[120px] max-h-[220px] overflow-y-auto custom-scrollbar">
                      {deliverables ? (
                        deliverables
                      ) : (
                        <div className="text-muted-foreground italic py-12 text-center text-xs">
                          Run a collection launch prompt above to see real-time {selectedDeptDetail.name} outputs.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Standard System Prompts / Focus Rules */}
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-xl bg-muted/10 border border-border/40">
                      <span className="text-[9px] font-bold uppercase text-muted-foreground block">Core Focus</span>
                      <strong className="text-foreground mt-0.5 block">{selectedDeptDetail.focus}</strong>
                    </div>
                    <div className="p-3.5 rounded-xl bg-muted/10 border border-border/40">
                      <span className="text-[9px] font-bold uppercase text-muted-foreground block">Target Metric</span>
                      <strong className="text-primary mt-0.5 block">{selectedDeptDetail.metric}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-border/40">
                  <Button 
                    onClick={() => setSelectedDeptDetail(null)}
                    className="font-bold text-xs uppercase bg-primary text-primary-foreground px-6 h-10 cursor-pointer"
                  >
                    Close Dossier
                  </Button>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* AI Settings & Prompt Strengthener Modal */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent className="bg-background border-border sm:max-w-[550px] font-sans text-foreground">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tighter uppercase flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" /> AI Tweaks & Prompt Strengthener
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Fine-tune the generative parameters, logging detail, and forcefully inject custom instructions into the copywriting engine.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            {/* Autopsy & 200% IQ Toggles */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl border border-border bg-black/20 space-y-1.5 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Autopsy Mode</label>
                  <input
                    type="checkbox"
                    checked={settingAutopsy}
                    onChange={(e) => setSettingAutopsy(e.target.checked)}
                    className="w-4 h-4 accent-primary cursor-pointer"
                  />
                </div>
                <p className="text-[9px] text-muted-foreground leading-normal">Runs structural analysis of textures, fabric weights, trim, and colors.</p>
              </div>

              <div className="p-3.5 rounded-xl border border-border bg-black/20 space-y-1.5 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">200% IQ Mode</label>
                  <input
                    type="checkbox"
                    checked={setting200Iq}
                    onChange={(e) => setSetting200Iq(e.target.checked)}
                    className="w-4 h-4 accent-primary cursor-pointer"
                  />
                </div>
                <p className="text-[9px] text-muted-foreground leading-normal">Enhances vocabulary, density, and layout complexity for premium styling copy.</p>
              </div>
            </div>

            {/* Exposed Logs, Kill Critical, 10 Think Toggles */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl border border-border bg-black/20 space-y-1.5 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">Exposed Logs</label>
                  <input
                    type="checkbox"
                    checked={settingExposedLogs}
                    onChange={(e) => setSettingExposedLogs(e.target.checked)}
                    className="w-3.5 h-3.5 accent-primary cursor-pointer"
                  />
                </div>
                <p className="text-[8px] text-muted-foreground leading-tight">Streams backend logs step-by-step to the workspace console.</p>
              </div>

              <div className="p-3 rounded-xl border border-border bg-black/20 space-y-1.5 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">Kill Critical</label>
                  <input
                    type="checkbox"
                    checked={settingKillCritical}
                    onChange={(e) => setSettingKillCritical(e.target.checked)}
                    className="w-3.5 h-3.5 accent-primary cursor-pointer"
                  />
                </div>
                <p className="text-[8px] text-muted-foreground leading-tight">Enforces strict file size filters and format schema gates.</p>
              </div>

              <div className="p-3 rounded-xl border border-border bg-black/20 space-y-1.5 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">10 Think Pts</label>
                  <input
                    type="checkbox"
                    checked={setting10ThinkPoints}
                    onChange={(e) => setSetting10ThinkPoints(e.target.checked)}
                    className="w-3.5 h-3.5 accent-primary cursor-pointer"
                  />
                </div>
                <p className="text-[8px] text-muted-foreground leading-tight">Instructs model to run 10 checks on marketing design elements.</p>
              </div>
            </div>

            {/* Custom Prompt Directive */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Force Custom Prompt Directive</label>
              <textarea
                placeholder="e.g. Focus on organic heavy cotton, describe visual drop-shoulder cuts, enforce gothic vocabulary..."
                value={settingCustomPrompt}
                onChange={(e) => setSettingCustomPrompt(e.target.value)}
                className="w-full bg-black/40 border border-border rounded-xl p-3 text-xs leading-relaxed text-foreground min-h-[90px] focus:outline-none focus:ring-1 focus:ring-primary/40 placeholder:text-muted-foreground/50"
                rows={3}
              />
              <p className="text-[9px] text-muted-foreground">This guideline is forcefully appended directly to the AI's core generative prompt instruction.</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
            <Button
              variant="outline"
              onClick={() => setShowSettingsDialog(false)}
              className="font-bold text-xs uppercase h-10 px-5 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveAiSettings}
              className="font-bold text-xs uppercase bg-primary hover:bg-primary/90 text-primary-foreground h-10 px-6 cursor-pointer"
            >
              Save AI Tweaks
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
