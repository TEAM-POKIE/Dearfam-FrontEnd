// import { useState, useEffect } from "react";
// import ReactFlow, {
//   Controls,
//   Node,
//   Edge,
//   NodeProps,
//   Handle,
//   Position,
// } from "reactflow";
// import "reactflow/dist/style.css";
// import bgTree from "../../assets/image/section7/bg_familytree_2.svg";
// import profileIcon from "../../assets/image/style_icon_profile.svg";
// import { BasicLoading } from "@/components/BasicLoading";

// 커스텀 노드 컴포넌트
// const CustomNode: React.FC<NodeProps<{ name: string; imageUrl?: string }>> = ({
//   data,
// }) => {
//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         padding: "5px",
//         boxSizing: "border-box",
//         border: "1px solid transparent",
//         borderRadius: "4px",
//       }}
//     >
//       <Handle
//         type="target"
//         position={Position.Top}
//         style={{
//           background: "#555",
//           width: "8px",
//           height: "8px",
//           borderRadius: "4px",
//         }}
//       />
//       <img
//         src={data.imageUrl || profileIcon}
//         alt={data.name}
//         style={{
//           width: 50,
//           height: 50,
//           borderRadius: "50%",
//           objectFit: "cover",
//           border: "2px solid #ddd",
//         }}
//       />
//       <div style={{ marginTop: 5, fontSize: 12, fontWeight: "bold" }}>
//         {data.name}
//       </div>
//       <Handle
//         type="source"
//         position={Position.Bottom}
//         style={{
//           background: "#555",
//           width: "8px",
//           height: "8px",
//           borderRadius: "4px",
//         }}
//       />
//     </div>
//   );
// };

// // HUB 노드 컴포넌트
// const HubNode: React.FC<NodeProps> = () => {
//   return (
//     <div
//       style={{
//         width: 10,
//         height: 10,
//         borderRadius: "50%",
//         background: "rgba(100, 100, 100, 0.3)", // 약간 보이도록 수정 (디버깅/확인용)
//       }}
//     >
//       <Handle
//         type="target"
//         position={Position.Top}
//         style={{ top: "-4px", background: "transparent", border: "none" }}
//       />
//       <Handle
//         type="source"
//         position={Position.Bottom}
//         style={{ bottom: "-4px", background: "transparent", border: "none" }}
//       />
//     </div>
//   );
// };

// interface Member {
//   id: string;
//   name: string;
//   role: "parentMale" | "parentFemale" | "childMale" | "childFemale";
// }

// interface FamilySample {
//   label: string;
//   value: string;
//   members: Member[];
// }

// const sonOnlySample: FamilySample = {
//   label: "아들 1명",
//   value: "son_only1",
//   members: [{ id: "c1", name: "아들", role: "childMale" }],
// };

// const familySamplesGenerated: FamilySample[] = Array.from(
//   { length: 5 },
//   (_, i) => i + 1
// ).flatMap((childCount) => [
//   {
//     label: `아빠, 자녀 ${childCount}명`,
//     value: `father_children${childCount}`,
//     members: [
//       { id: "p1", name: "아빠", role: "parentMale" as const },
//       ...Array.from({ length: childCount }, (_, j) => ({
//         id: `c${j + 1}`,
//         name: `자녀${j + 1}`,
//         role: (j % 2 === 0 ? "childMale" : "childFemale") as
//           | "childMale"
//           | "childFemale",
//       })),
//     ],
//   },
//   {
//     label: `엄마, 자녀 ${childCount}명`,
//     value: `mother_children${childCount}`,
//     members: [
//       { id: "p1", name: "엄마", role: "parentFemale" as const },
//       ...Array.from({ length: childCount }, (_, j) => ({
//         id: `c${j + 1}`,
//         name: `자녀${j + 1}`,
//         role: (j % 2 === 0 ? "childMale" : "childFemale") as
//           | "childMale"
//           | "childFemale",
//       })),
//     ],
//   },
//   {
//     label: `부모, 자녀 ${childCount}명`,
//     value: `parents_children${childCount}`,
//     members: [
//       { id: "p1", name: "아빠", role: "parentMale" as const },
//       { id: "p2", name: "엄마", role: "parentFemale" as const },
//       ...Array.from({ length: childCount }, (_, j) => ({
//         id: `c${j + 1}`,
//         name: `자녀${j + 1}`,
//         role: (j % 2 === 0 ? "childMale" : "childFemale") as
//           | "childMale"
//           | "childFemale",
//       })),
//     ],
//   },
// ]);

// const familySamples: FamilySample[] = [
//   sonOnlySample,
//   ...familySamplesGenerated,
// ];

// function getNodesAndEdges(sample: FamilySample): {
//   nodes: Node[];
//   edges: Edge[];
// } {
//   const { members } = sample;
//   const reactFlowNodes: Node[] = [];
//   const reactFlowEdges: Edge[] = [];

//   const parents = members.filter(
//     (m) => m.role === "parentMale" || m.role === "parentFemale"
//   );
//   const children = members.filter(
//     (m) => m.role === "childMale" || m.role === "childFemale"
//   );

//   const PARENT_Y = 50;
//   const CHILD_Y = 220;
//   const HUB_Y = (PARENT_Y + CHILD_Y) / 2; // HUB 노드 Y 위치를 부모와 자식 Y 레벨의 중간으로 수정
//   const NODE_WIDTH_ESTIMATE = 60;
//   const HUB_NODE_WIDTH_ESTIMATE = 10;
//   const BASE_HORIZONTAL_SPACING = NODE_WIDTH_ESTIMATE + 40;
//   const MIN_HORIZONTAL_SPACING = NODE_WIDTH_ESTIMATE + 10;
//   const CONTAINER_WIDTH = 390;
//   const X_CENTER_OFFSET = CONTAINER_WIDTH / 2;

//   members.forEach((member) => {
//     reactFlowNodes.push({
//       id: member.id,
//       data: { name: member.name, imageUrl: undefined },
//       position: { x: 0, y: 0 },
//       type: "customNode",
//     });
//   });

//   const calculateDynamicSpacing = (nodeCount: number) => {
//     if (nodeCount <= 3) return BASE_HORIZONTAL_SPACING;
//     return Math.max(
//       MIN_HORIZONTAL_SPACING,
//       BASE_HORIZONTAL_SPACING * (3 / nodeCount)
//     );
//   };

//   const edgeStyle = { stroke: "#FF5733", strokeWidth: 2.5 };
//   const edgeType = "smoothstep"; // 이미지와 유사하게 'smoothstep'으로 변경

//   if (parents.length > 0 && children.length > 0) {
//     const parentHorizontalSpacing = calculateDynamicSpacing(parents.length);
//     const parentTotalWidth = (parents.length - 1) * parentHorizontalSpacing;
//     const parentStartX = X_CENTER_OFFSET - parentTotalWidth / 2;
//     parents.forEach((p, i) => {
//       const node = reactFlowNodes.find((n) => n.id === p.id)!;
//       node.position = {
//         x: parentStartX + i * parentHorizontalSpacing - NODE_WIDTH_ESTIMATE / 2,
//         y: PARENT_Y,
//       };
//     });

//     // 자녀 노드 위치 설정
//     const childHorizontalSpacing = calculateDynamicSpacing(children.length);
//     const childrenTotalWidth = (children.length - 1) * childHorizontalSpacing;
//     const childrenStartX = X_CENTER_OFFSET - childrenTotalWidth / 2;
//     children.forEach((c, i) => {
//       const node = reactFlowNodes.find((n) => n.id === c.id)!;
//       node.position = {
//         x:
//           childrenStartX + i * childHorizontalSpacing - NODE_WIDTH_ESTIMATE / 2,
//         y: CHILD_Y,
//       };
//     });

//     if (parents.length === 2) {
//       // HUB 노드 생성 및 추가
//       const hubNodeId = "hub-node-family"; // 고유 ID
//       reactFlowNodes.push({
//         id: hubNodeId,
//         data: {},
//         position: {
//           x: X_CENTER_OFFSET - HUB_NODE_WIDTH_ESTIMATE / 2,
//           y: HUB_Y,
//         },
//         type: "hubNode",
//       });
//       // 부모 -> HUB 엣지
//       parents.forEach((p) => {
//         reactFlowEdges.push({
//           id: `e-${p.id}-${hubNodeId}`,
//           source: p.id,
//           target: hubNodeId,
//           type: edgeType,
//           animated: false,
//           style: edgeStyle,
//         });
//       });
//       // HUB -> 자녀 엣지
//       children.forEach((c) => {
//         reactFlowEdges.push({
//           id: `e-${hubNodeId}-${c.id}`,
//           source: hubNodeId,
//           target: c.id,
//           type: edgeType,
//           animated: false,
//           style: edgeStyle,
//         });
//       });
//     } else if (parents.length === 1) {
//       // 단일 부모 -> 모든 자녀 엣지
//       children.forEach((c) => {
//         reactFlowEdges.push({
//           id: `e-${parents[0].id}-${c.id}`,
//           source: parents[0].id,
//           target: c.id,
//           type: edgeType,
//           animated: false,
//           style: edgeStyle,
//         });
//       });
//     }
//   } else if (parents.length > 0) {
//     // 부모만 있는 경우
//     const parentHorizontalSpacing = calculateDynamicSpacing(parents.length);
//     const parentTotalWidth = (parents.length - 1) * parentHorizontalSpacing;
//     const parentStartX = X_CENTER_OFFSET - parentTotalWidth / 2;
//     parents.forEach((p, i) => {
//       const node = reactFlowNodes.find((n) => n.id === p.id)!;
//       node.position = {
//         x: parentStartX + i * parentHorizontalSpacing - NODE_WIDTH_ESTIMATE / 2,
//         y: (PARENT_Y + CHILD_Y) / 2,
//       };
//     });
//     // 부모가 2명이고 서로 연결되어야 하는 경우 (예: 배우자 관계). 현재 요구사항에서는 제거됨.
//     // if (parents.length === 2) {
//     //   reactFlowEdges.push({ id: `e-${parents[0].id}-${parents[1].id}`, source: parents[0].id, target: parents[1].id, type: edgeType, animated: false, style: edgeStyle });
//     // }
//   } else if (children.length > 0) {
//     // 자식만 있는 경우 (형제자매)
//     const childHorizontalSpacing = calculateDynamicSpacing(children.length);
//     const childrenTotalWidth = (children.length - 1) * childHorizontalSpacing;
//     const childrenStartX = X_CENTER_OFFSET - childrenTotalWidth / 2;
//     children.forEach((c, i) => {
//       const node = reactFlowNodes.find((n) => n.id === c.id)!;
//       node.position = {
//         x:
//           childrenStartX + i * childHorizontalSpacing - NODE_WIDTH_ESTIMATE / 2,
//         y: (PARENT_Y + CHILD_Y) / 2,
//       };
//     });
//     if (children.length > 1) {
//       for (let i = 0; i < children.length - 1; i++) {
//         reactFlowEdges.push({
//           id: `e-${children[i].id}-${children[i + 1].id}`,
//           source: children[i].id,
//           target: children[i + 1].id,
//           type: edgeType,
//           animated: false,
//           style: edgeStyle,
//         });
//       }
//     }
//   }

//   if (members.length === 1 && reactFlowNodes.length === 1) {
//     const node = reactFlowNodes[0];
//     node.position = {
//       x: X_CENTER_OFFSET - NODE_WIDTH_ESTIMATE / 2,
//       y: (PARENT_Y + CHILD_Y) / 2,
//     };
//   }

//   // console.log("Generated Nodes:", JSON.parse(JSON.stringify(reactFlowNodes))); // 디버깅 완료 후 주석 처리 또는 삭제
//   // console.log("Generated Edges:", JSON.parse(JSON.stringify(reactFlowEdges))); // 디버깅 완료 후 주석 처리 또는 삭제

//   return { nodes: reactFlowNodes, edges: reactFlowEdges };
// }

// const nodeTypes = {
//   customNode: CustomNode,
//   hubNode: HubNode, // HubNode 등록
// };

export function FamilyPage() {
  // const [isLoading, setIsLoading] = useState(true);
  // const defaultSample =
  //   familySamples.find((f) => f.value === "son_only1") || familySamples[0];
  // const [selected] = useState<FamilySample>(defaultSample);
  // const { nodes, edges } = getNodesAndEdges(selected);

  // // 컴포넌트가 마운트되면 로딩 완료
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 1000); // 1초 후 로딩 완료

  //   return () => clearTimeout(timer);
  // }, []);

  // // 로딩 중일 때 로딩 화면 표시
  // if (isLoading) {
  //   return (
  //     <div className="bg-bg-1 min-h-screen">
  //       <BasicLoading fullscreen text="가족 페이지 로딩 중..." size={80} />
  //     </div>
  //   );
  // }

  return (
    <div className="flex justify-center items-center mt-[20rem]">
      <div className="text-h2 text-center">버전 2에서 출시 예정입니다</div>
    </div>

    // <div className="flex justify-center items-center h-app bg-bg-1">
    //   <div className="mobile-container flex flex-col overflow-y-auto">
    //     <div className="w-full h-full relative">
    //       <div
    //         className="absolute inset-0 bg-cover bg-center bg-no-repeat"
    //         style={{ backgroundImage: `url(${bgTree})` }}
    //       />
    //       <div className="relative z-10 w-full h-full">
    //         <ReactFlow
    //           nodes={nodes}
    //           edges={edges}
    //           nodeTypes={nodeTypes}
    //           fitView
    //           attributionPosition="top-right"
    //         >
    //           <Controls />
    //         </ReactFlow>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}
