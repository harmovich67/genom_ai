import React, { useState, useMemo, useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useGenomeStore } from '../../store/genomeStore';
import { useProjectStore } from '../../store/projectStore';
import { useDebugStore } from '../../store/debugStore';
import { useUIStore } from '../../store/uiStore';
import {
  Dna,
  GitBranch,
  Layers,
  FolderGit2,
  Bug,
  Sparkles,
  ExternalLink,
  Filter,
  Maximize2,
  Info,
  X
} from 'lucide-react';

// Custom Node for Snippets / Genomes
function SnippetNode({ data }) {
  return (
    <div className="px-4 py-3 rounded-2xl bg-white dark:bg-[#090D17]/95 border-2 border-emerald-500/60 hover:border-emerald-600 dark:hover:border-emerald-400 shadow-md dark:shadow-glow-emerald text-right min-w-[200px] cursor-pointer transition-all hover:scale-105">
      <Handle type="target" position={Position.Top} className="!bg-emerald-400 !w-2.5 !h-2.5" />
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-300">
          {data.technology}
        </span>
        <div className="w-5 h-5 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
          <Dna className="w-3 h-3" />
        </div>
      </div>
      <h5 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{data.label}</h5>
      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">{data.type}</p>
      <Handle type="source" position={Position.Bottom} className="!bg-emerald-400 !w-2.5 !h-2.5" />
    </div>
  );
}

// Custom Node for Concepts
function ConceptNode({ data }) {
  return (
    <div className="px-3 py-2 rounded-xl bg-white dark:bg-[#0A101D]/90 border border-cyan-500/50 hover:border-cyan-600 dark:hover:border-cyan-400 shadow-md dark:shadow-glow-cyan text-right min-w-[140px] cursor-pointer transition-all hover:scale-105">
      <Handle type="target" position={Position.Top} className="!bg-cyan-400 !w-2 !h-2" />
      <div className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-300">
        <GitBranch className="w-3.5 h-3.5" />
        <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{data.label}</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-cyan-400 !w-2 !h-2" />
    </div>
  );
}

// Custom Node for Technologies
function TechNode({ data }) {
  return (
    <div className="px-4 py-2.5 rounded-2xl bg-white dark:bg-[#140C22]/95 border-2 border-purple-500/60 hover:border-purple-600 dark:hover:border-purple-400 shadow-md dark:shadow-glow-purple text-right min-w-[160px] cursor-pointer transition-all hover:scale-105">
      <Handle type="target" position={Position.Top} className="!bg-purple-400 !w-2.5 !h-2.5" />
      <div className="flex items-center justify-between">
        <span className="text-xs font-extrabold text-purple-700 dark:text-purple-200 font-mono">{data.label}</span>
        <div className="w-5 h-5 rounded-lg bg-purple-500/20 text-purple-600 dark:text-purple-300 flex items-center justify-center">
          <Layers className="w-3 h-3" />
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-purple-400 !w-2.5 !h-2.5" />
    </div>
  );
}

// Custom Node for Projects
function ProjectNode({ data }) {
  return (
    <div className="px-4 py-3 rounded-2xl bg-white dark:bg-[#161208]/95 border-2 border-amber-500/60 hover:border-amber-600 dark:hover:border-amber-400 shadow-md text-right min-w-[190px] cursor-pointer transition-all hover:scale-105">
      <Handle type="target" position={Position.Top} className="!bg-amber-400 !w-2.5 !h-2.5" />
      <div className="flex items-center gap-2 mb-1 text-amber-600 dark:text-amber-400">
        <FolderGit2 className="w-3.5 h-3.5" />
        <span className="text-[10px] font-mono font-bold">PROJECT WORKSPACE</span>
      </div>
      <h5 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{data.label}</h5>
      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 mt-0.5 block">{data.progress}% إنجاز</span>
      <Handle type="source" position={Position.Bottom} className="!bg-amber-400 !w-2.5 !h-2.5" />
    </div>
  );
}

// Custom Node for Bugs
function BugNode({ data }) {
  return (
    <div className="px-3.5 py-2.5 rounded-2xl bg-white dark:bg-[#1D0A11]/95 border border-rose-500/60 hover:border-rose-600 dark:hover:border-rose-400 shadow-md text-right min-w-[170px] cursor-pointer transition-all hover:scale-105">
      <Handle type="target" position={Position.Top} className="!bg-rose-400 !w-2 !h-2" />
      <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 mb-0.5">
        <Bug className="w-3 h-3" />
        <span className="text-[10px] font-mono font-bold">PREVENTED BUG</span>
      </div>
      <h5 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{data.label}</h5>
      <Handle type="source" position={Position.Bottom} className="!bg-rose-400 !w-2 !h-2" />
    </div>
  );
}

const nodeTypes = {
  snippetNode: SnippetNode,
  conceptNode: ConceptNode,
  techNode: TechNode,
  projectNode: ProjectNode,
  bugNode: BugNode
};

export default function KnowledgeGraph() {
  const genomes = useGenomeStore((s) => s.genomes);
  const projects = useProjectStore((s) => s.projects);
  const bugs = useDebugStore((s) => s.bugs);
  const setSelectedGenome = useGenomeStore((s) => s.setSelectedGenome);
  const { openModal } = useUIStore();

  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'snippet' | 'concept' | 'tech' | 'project' | 'bug'
  const [selectedNodeData, setSelectedNodeData] = useState(null);

  // Generate Nodes and Edges based on actual application entities
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes = [];
    const edges = [];

    // 1. Technologies Nodes (Top level)
    const techItems = [
      { id: 'tech-react', label: 'React', x: 100, y: 50 },
      { id: 'tech-node', label: 'Node.js', x: 380, y: 50 },
      { id: 'tech-salla', label: 'Salla API', x: 660, y: 50 },
      { id: 'tech-redis', label: 'Redis', x: 940, y: 50 },
      { id: 'tech-mysql', label: 'MySQL', x: 1200, y: 50 }
    ];

    techItems.forEach((t) => {
      nodes.push({
        id: t.id,
        type: 'techNode',
        position: { x: t.x, y: t.y },
        data: { label: t.label, category: 'tech' }
      });
    });

    // 2. Concepts Nodes (Middle level)
    const concepts = [
      { id: 'c-hooks', label: 'Hooks', x: 60, y: 170, parent: 'tech-react' },
      { id: 'c-effect', label: 'useEffect', x: 180, y: 260, parent: 'c-hooks' },
      { id: 'c-closure', label: 'Stale Closures', x: 260, y: 360, parent: 'c-effect' },
      { id: 'c-jwt', label: 'JWT Rotation', x: 380, y: 170, parent: 'tech-node' },
      { id: 'c-hmac', label: 'HMAC SHA256', x: 660, y: 170, parent: 'tech-salla' },
      { id: 'c-lock', label: 'Redlock / Lua', x: 940, y: 170, parent: 'tech-redis' },
      { id: 'c-deadlock', label: 'Deadlocks', x: 1200, y: 170, parent: 'tech-mysql' }
    ];

    concepts.forEach((c) => {
      nodes.push({
        id: c.id,
        type: 'conceptNode',
        position: { x: c.x, y: c.y },
        data: { label: c.label, category: 'concept' }
      });

      edges.push({
        id: `e-${c.parent}-${c.id}`,
        source: c.parent,
        target: c.id,
        label: 'Depends on',
        animated: true,
        style: { stroke: '#06B6D4', strokeWidth: 1.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#06B6D4' }
      });
    });

    // 3. Genomes / Snippet Nodes
    genomes.slice(0, 6).forEach((g, idx) => {
      const posX = 120 + idx * 220;
      const posY = 460 + (idx % 2 === 0 ? 0 : 40);
      const nodeId = `genome-${g.id}`;

      nodes.push({
        id: nodeId,
        type: 'snippetNode',
        position: { x: posX, y: posY },
        data: {
          label: g.title,
          technology: g.technology,
          type: g.type,
          rawItem: g,
          category: 'snippet'
        }
      });

      // Link to concept
      if (idx === 0) {
        edges.push({
          id: `e-c-effect-${nodeId}`,
          source: 'c-effect',
          target: nodeId,
          label: 'Solves',
          style: { stroke: '#10B981', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#10B981' }
        });
      } else if (idx === 1) {
        edges.push({
          id: `e-c-hmac-${nodeId}`,
          source: 'c-hmac',
          target: nodeId,
          label: 'Implements',
          style: { stroke: '#10B981', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#10B981' }
        });
      } else if (idx === 2) {
        edges.push({
          id: `e-c-jwt-${nodeId}`,
          source: 'c-jwt',
          target: nodeId,
          label: 'Guards',
          style: { stroke: '#10B981', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#10B981' }
        });
      } else if (idx === 5) {
        edges.push({
          id: `e-c-lock-${nodeId}`,
          source: 'c-lock',
          target: nodeId,
          label: 'Locks',
          style: { stroke: '#10B981', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#10B981' }
        });
      }
    });

    // 4. Projects Nodes (Bottom level)
    projects.slice(0, 2).forEach((p, idx) => {
      const nodeId = `proj-${p.id}`;
      nodes.push({
        id: nodeId,
        type: 'projectNode',
        position: { x: 300 + idx * 500, y: 640 },
        data: {
          label: p.name,
          progress: p.progress,
          rawProject: p,
          category: 'project'
        }
      });

      // Edges to used genomes
      edges.push({
        id: `e-genome-1-${nodeId}`,
        source: 'genome-1',
        target: nodeId,
        label: 'Used in',
        style: { stroke: '#F59E0B', strokeDasharray: '5,5' },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#F59E0B' }
      });
      if (idx === 0) {
        edges.push({
          id: `e-genome-6-${nodeId}`,
          source: 'genome-6',
          target: nodeId,
          label: 'Used in',
          style: { stroke: '#F59E0B', strokeDasharray: '5,5' },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#F59E0B' }
        });
      }
    });

    // 5. Bug Nodes
    bugs.slice(0, 2).forEach((b, idx) => {
      const nodeId = `bug-${b.id}`;
      nodes.push({
        id: nodeId,
        type: 'bugNode',
        position: { x: 260 + idx * 750, y: 280 },
        data: {
          label: b.title,
          rawBug: b,
          category: 'bug'
        }
      });

      edges.push({
        id: `e-${nodeId}-genome-${idx === 0 ? 1 : 6}`,
        source: nodeId,
        target: `genome-${idx === 0 ? 1 : 6}`,
        label: 'Learned from',
        style: { stroke: '#F43F5E' },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#F43F5E' }
      });
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [genomes, projects, bugs]);

  // Filter nodes based on activeFilter
  const filteredNodes = useMemo(() => {
    if (activeFilter === 'all') return initialNodes;
    return initialNodes.filter((n) => n.data.category === activeFilter);
  }, [initialNodes, activeFilter]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync filtered nodes
  React.useEffect(() => {
    setNodes(filteredNodes);
  }, [filteredNodes, setNodes]);

  const handleNodeClick = useCallback(
    (event, node) => {
      setSelectedNodeData(node.data);
      if (node.data.category === 'snippet' && node.data.rawItem) {
        setSelectedGenome(node.data.rawItem);
        openModal('genomeDetail', node.data.rawItem);
      }
    },
    [setSelectedGenome, openModal]
  );

  return (
    <div className="space-y-4">
      {/* Top Filter and Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl glass-panel">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400">
            <GitBranch className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white font-heading">
              خريطة شبكة المعرفة التفاعلية (React Flow Knowledge Graph)
            </h3>
            <p className="text-[10px] text-slate-400">
              استكشف ترابط الجينومات والمفاهيم، واسحب وتحكم في العقد والأطراف بحرية
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-medium">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-xl transition-all ${
              activeFilter === 'all'
                ? 'bg-purple-600 text-white font-bold shadow-glow-purple'
                : 'bg-white/[0.04] text-slate-300 hover:text-white'
            }`}
          >
            الكل ({initialNodes.length})
          </button>
          <button
            onClick={() => setActiveFilter('snippet')}
            className={`px-3 py-1 rounded-xl transition-all ${
              activeFilter === 'snippet'
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-white/[0.04] text-slate-300 hover:text-white'
            }`}
          >
            الجينومات
          </button>
          <button
            onClick={() => setActiveFilter('concept')}
            className={`px-3 py-1 rounded-xl transition-all ${
              activeFilter === 'concept'
                ? 'bg-cyan-600 text-white font-bold'
                : 'bg-white/[0.04] text-slate-300 hover:text-white'
            }`}
          >
            المفاهيم
          </button>
          <button
            onClick={() => setActiveFilter('tech')}
            className={`px-3 py-1 rounded-xl transition-all ${
              activeFilter === 'tech'
                ? 'bg-purple-600 text-white font-bold'
                : 'bg-white/[0.04] text-slate-300 hover:text-white'
            }`}
          >
            التقنيات
          </button>
          <button
            onClick={() => setActiveFilter('project')}
            className={`px-3 py-1 rounded-xl transition-all ${
              activeFilter === 'project'
                ? 'bg-amber-600 text-white font-bold'
                : 'bg-white/[0.04] text-slate-300 hover:text-white'
            }`}
          >
            المشاريع
          </button>
          <button
            onClick={() => setActiveFilter('bug')}
            className={`px-3 py-1 rounded-xl transition-all ${
              activeFilter === 'bug'
                ? 'bg-rose-600 text-white font-bold'
                : 'bg-white/[0.04] text-slate-300 hover:text-white'
            }`}
          >
            الأخطاء المحلولة
          </button>
        </div>
      </div>

      {/* Main React Flow Canvas */}
      <div className="relative w-full h-[580px] rounded-3xl glass-panel border border-slate-200 dark:border-white/[0.08] overflow-hidden dir-ltr">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          onNodeClick={handleNodeClick}
          fitView
          attributionPosition="bottom-left"
          className="bg-slate-50 dark:bg-[#050811]"
        >
          <Background color="#94a3b8" gap={20} size={1} />
          <Controls className="!bg-white dark:!bg-[#090D17] !border-slate-200 dark:!border-white/[0.1] !rounded-xl overflow-hidden [&>button]:!bg-white dark:[&>button]:!bg-[#090D17] [&>button]:!border-slate-200 dark:[&>button]:!border-white/[0.08] [&>button]:!text-slate-700 dark:[&>button]:!text-slate-300 hover:[&>button]:!text-emerald-500" />
          <MiniMap
            nodeStrokeColor="#10B981"
            nodeColor="#cbd5e1"
            nodeBorderRadius={8}
            className="!bg-white/90 dark:!bg-[#090D17]/90 !border !border-slate-200 dark:!border-white/[0.1] !rounded-xl !overflow-hidden"
          />
        </ReactFlow>

        {/* Floating Node Info Inspector (if selected) */}
        {selectedNodeData && (
          <div className="absolute top-4 right-4 z-20 max-w-xs p-4 rounded-2xl glass-dropdown border border-slate-200 dark:border-white/[0.15] shadow-2xl space-y-2 text-right dir-rtl animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {selectedNodeData.category} NODE
              </span>
              <button
                onClick={() => setSelectedNodeData(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">{selectedNodeData.label}</h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              {selectedNodeData.category === 'snippet'
                ? 'انقر نقرة مزدوجة أو استخدم الزر أدناه لفتح تفاصيل الجينوم والـ DNA الكامل.'
                : 'عقدة تفاعلية مرتبطة بالجينومات والمشاريع في الشبكة المعرفية.'}
            </p>
            {selectedNodeData.rawItem && (
              <button
                onClick={() => {
                  setSelectedGenome(selectedNodeData.rawItem);
                  openModal('genomeDetail', selectedNodeData.rawItem);
                }}
                className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-glow-emerald transition-all mt-2 cursor-pointer"
              >
                فتح بطاقة الجينوم
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-2 font-mono">
        <span>💡 يمكنك تحريك أي عقدة، تكبير وتصغير الرسم، والضغط على أي جينوم لفتحه مباشرة.</span>
        <span>CODE GENOME NETWORK GRAPH</span>
      </div>
    </div>
  );
}
