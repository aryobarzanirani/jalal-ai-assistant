export async function checkQuota(env) {
  const today = new Date().toISOString().slice(0, 10);
  const key = `quota:${today}`;

  const data = await env.MEMORY.get(key);

  let count = 0;

  if (data) {
    count = Number(data);
  }

  count += 1;

  await env.MEMORY.put(key, count.toString());

  const quotaLimit = 20;
  const remaining = quotaLimit - count;

  let warning = null;

  if (count === 18) {
    warning = "⚠️ هشدار: شما ۹۰٪ ظرفیت روزانه Gemini را مصرف کرده‌اید.";
  } else if (count === 19) {
    warning = "⚠️ هشدار: فقط ۱ درخواست دیگر از ظرفیت روزانه باقی مانده.";
  } else if (count >= 21) {
    return {
      allowed: false,
      warning: "⛔ ظرفیت روزانه Gemini به پایان رسیده. لطفاً فردا دوباره تلاش کنید."
    };
  }

  return {
    allowed: true,
    count,
    remaining,
    warning
  };
}
