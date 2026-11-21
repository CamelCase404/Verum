export function CodeBlock({ code }: { code: string }) {
    const lines = code.split("\n");
    return (
        <div className="bg-[#1e1e1e] text-[#d4d4d4] rounded-xl overflow-hidden border border-line mt-3 flex">
            {/* Нумерация */}
            <div className="bg-[#181818] text-[#858585] py-3 px-2 text-right font-mono text-[12px] select-none border-r border-[#333]">
                {lines.map((_, i) => <div key={i}>{i + 1}</div>)}
            </div>
            {/* Код */}
            <pre className="p-3 overflow-x-auto text-[12px] font-mono whitespace-pre flex-1">
                <code>{code}</code>
            </pre>
        </div>
    );
}
