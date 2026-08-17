const fs = require('fs');

let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Add state variable if not present
if (!content.includes('showAllTransactions')) {
  content = content.replace(
    /const \[profile, setProfile\] = useState[^;]*;/,
    (match) => `${match}\n  const [showAllTransactions, setShowAllTransactions] = useState(false);`
  );
}

// 2. Identify the transaction map block using regex
// Finds {transactions.map(...) ... )} or similar
const regex = /\{transactions(?:\.length > 0 \? transactions|\?\.length > 0 \? transactions)?\.map\([\s\S]*?\)\s*\}/;

if (regex.test(content)) {
  const replacement = `{(() => {
                const displayedTransactions = showAllTransactions
                  ? transactions
                  : (transactions || []).slice(0, 6);

                return (
                  <>
                    {displayedTransactions.map((tx: any) => (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={\`w-2 h-2 rounded-full \${
                              tx.type === 'payment'
                                ? 'bg-emerald-400'
                                : tx.type === 'late_fee'
                                ? 'bg-red-400'
                                : 'bg-blue-400'
                            }\`}
                          />
                          <div>
                            <p className="text-xs font-semibold text-white">
                              {tx.description || (tx.type === 'payment' ? 'Rent Payment' : 'Monthly Rent Charge')}
                            </p>
                            <p className="text-[10px] text-neutral-400 mt-0.5">
                              {new Date(tx.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={\`text-xs font-bold \${
                              tx.type === 'payment'
                                ? 'text-emerald-400'
                                : 'text-neutral-200'
                            }\`}
                          >
                            {tx.type === 'payment' ? '-' : '+'}
                            ${parseFloat(tx.amount || 0).toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                            })}
                          </p>
                          <span
                            className={\`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md \${
                              tx.status === 'completed' || tx.status === 'paid'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                            }\`}
                          >
                            {tx.status || 'completed'}
                          </span>
                        </div>
                      </div>
                    ))}

                    {transactions && transactions.length > 6 && (
                      <div className="pt-2 text-center">
                        <button
                          type="button"
                          onClick={() => setShowAllTransactions(!showAllTransactions)}
                          className="w-full py-2.5 px-4 rounded-xl border border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800/80 text-[11px] font-semibold text-neutral-300 hover:text-white transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <span>
                            {showAllTransactions
                              ? 'Show Less ↑'
                              : `Show All Transactions (${transactions.length} total) ↓`}
                          </span>
                        </button>
                      </div>
                    )}
                  </>
                );
              })()}`;

  content = content.replace(regex, replacement);
  fs.writeFileSync('src/app/page.tsx', content, 'utf8');
  console.log('✅ Successfully updated Account Ledger to 6 transactions with toggle!');
} else {
  console.log('⚠️ Printing lines around "transactions" to identify exact pattern:');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('transactions')) {
      console.log(`Line ${idx + 1}: ${line}`);
    }
  });
}
