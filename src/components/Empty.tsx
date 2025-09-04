import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const complaintMethods = {
  "12333劳动监察大队投诉": {
    steps: [
      "拨打12333热线",
      "选择人工服务",
      "提供个人信息和投诉内容",
      "记录投诉编号以便查询进度"
    ],
    contact: "12333热线",
    notes: "工作日9:00-17:00提供服务"
  },
  "欠薪线索反馈小程序": {
    steps: [
      "微信搜索'欠薪线索反馈'小程序",
      "注册并登录账号",
      "填写欠薪详细信息",
      "上传相关证据材料",
      "提交并等待处理"
    ],
    contact: "微信小程序",
    notes: "需提供劳动合同或工资条等证明"
  },
  "个人所得税申诉": {
    steps: [
      "登录个人所得税APP",
      "进入'服务'-'收入纳税明细查询'",
      "选择有异议的记录点击'申诉'",
      "填写申诉理由并提交",
      "等待税务部门核实"
    ],
    contact: "个人所得税APP",
    notes: "申诉后一般15个工作日内处理"
  },
  "劳动仲裁": {
    steps: [
      "准备仲裁申请书和相关证据",
      "到当地劳动人事争议仲裁委员会提交申请",
      "等待受理通知书",
      "参加仲裁庭审",
      "领取仲裁裁决书"
    ],
    contact: "当地劳动仲裁委员会",
    notes: "时效为争议发生之日起1年内"
  },
  "法院诉讼": {
    steps: [
      "准备起诉状和证据材料",
      "到有管辖权的人民法院立案",
      "缴纳诉讼费",
      "等待开庭通知",
      "参加庭审",
      "等待判决结果"
    ],
    contact: "人民法院",
    notes: "建议先咨询专业律师"
  },
  "961193消防举报": {
    steps: [
      "拨打96119举报电话",
      "详细说明消防隐患情况",
      "提供隐患地点信息",
      "可要求匿名举报",
      "等待消防部门核查"
    ],
    contact: "96119热线",
    notes: "24小时受理举报"
  },
  "投诉不缴纳社保": {
    steps: [
      "收集工资流水等劳动关系证明",
      "到当地社保稽核部门投诉",
      "填写投诉登记表",
      "配合调查核实",
      "等待处理结果"
    ],
    contact: "社保局稽核科",
    notes: "可同时向劳动监察投诉"
  },
  "举报偷税漏税": {
    steps: [
      "收集相关证据材料",
      "到税务机关稽查局举报",
      "填写举报登记表",
      "可选择实名或匿名",
      "等待税务部门查处"
    ],
    contact: "12366纳税服务热线",
    notes: "查实后可获得奖励"
  }
};

export function ComplaintCard({ method, onClose }: { method: string; onClose: () => void }) {
  const data = complaintMethods[method as keyof typeof complaintMethods];
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div 
        className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-medium">{method}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">操作步骤：</h4>
            <ol className="list-decimal pl-5 space-y-1">
              {data.steps.map((step, i) => (
                <li key={i} className="text-gray-700">{step}</li>
              ))}
            </ol>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800">联系方式：</h4>
            <p className="text-gray-700">{data.contact}</p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800">注意事项：</h4>
            <p className="text-gray-700">{data.notes}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Empty() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  return (
    <div className={cn("flex h-full w-full items-center justify-center relative")}>
      {/* 水印层 - 与投诉渠道指南同一层级 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{
            backgroundImage: 'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><text x="0" y="200" font-family="Microsoft YaHei, SimHei, sans-serif" font-size="48" fill="rgba(0,0,0,0.1)" transform="rotate(-30,200,200)">项总还钱</text></svg>\')',
            backgroundRepeat: 'repeat',
            backgroundSize: '400px 400px'
          }}
        ></div>
      </div>


      <div className="w-full max-w-md flex flex-col items-center justify-center p-4 relative z-10">
        <div className="text-lg font-medium mb-4">投诉渠道指南</div>
        <div className="grid grid-cols-2 gap-4 w-full">
          {Object.keys(complaintMethods).map((method) => (
            <div 
              key={method}
              className="p-2 border rounded hover:bg-gray-50 cursor-pointer"
              onClick={() => setSelectedMethod(method)}
            >
              {method}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedMethod && (
          <ComplaintCard 
            method={selectedMethod} 
            onClose={() => setSelectedMethod(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}