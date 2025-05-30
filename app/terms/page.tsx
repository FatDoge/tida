'use client';

import { Suspense } from 'react';
import { Triangle } from 'lucide-react';
import { useI18n } from '@/providers/i18n-provider';
import { Skeleton } from '@/components/ui/skeleton';
import Footer from '@/components/layout/footer';

export default function TermsPage() {
  return (
    <Suspense fallback={<TermsSkeleton />}>
      <TermsContent />
    </Suspense>
  );
}

function TermsContent() {
  const { t, isLoaded } = useI18n();
  
  if (!isLoaded) {
    return <TermsSkeleton />;
  }
  
  return (
    <>
      <div className="container mx-auto py-12 px-4 max-w-4xl space-y-6 animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <Triangle className="h-12 w-12 text-primary mb-4" />
          <h1 className="text-3xl font-bold text-center">使用条款</h1>
        </div>
        
        <div className="prose dark:prose-invert max-w-none">
          <p>最后更新日期：{new Date().toLocaleDateString()}</p>
          
          <h2>1. 接受条款</h2>
          <p>欢迎使用我们的任务管理应用（以下简称"应用"）。通过访问或使用我们的应用，您同意受本使用条款的约束。如果您不同意这些条款，请勿使用本应用。</p>
          
          <h2>2. 账户注册与安全</h2>
          <p>使用本应用的某些功能可能需要您注册账户。您同意：</p>
          <ul>
            <li>提供准确、完整的注册信息</li>
            <li>妥善保管您的账户密码</li>
            <li>对您账户下的所有活动负责</li>
            <li>发现任何未授权使用您账户的情况时立即通知我们</li>
          </ul>
          
          <h2>3. 用户行为</h2>
          <p>您同意不会：</p>
          <ul>
            <li>违反任何适用的法律法规</li>
            <li>侵犯他人的知识产权或其他权利</li>
            <li>上传或分享包含病毒、恶意代码的内容</li>
            <li>干扰或破坏应用的正常运行</li>
            <li>未经授权访问我们的服务器或网络</li>
          </ul>
          
          <h2>4. 知识产权</h2>
          <p>本应用及其内容（包括但不限于文本、图形、徽标、图标、图像、音频剪辑、数字下载和软件）是我们或我们的许可方的财产，受版权、商标和其他知识产权法保护。</p>
          
          <h2>5. 用户内容</h2>
          <p>您保留您在应用中创建或上传的内容（"用户内容"）的所有权利。通过提交用户内容，您授予我们全球性、非独占、免版税的许可，允许我们使用、复制、修改、发布和展示该用户内容，以便提供和改进我们的服务。</p>
          
          <h2>6. 第三方链接与服务</h2>
          <p>我们的应用可能包含指向第三方网站或服务的链接。我们不对这些第三方网站或服务的内容、隐私政策或做法负责。</p>
          
          <h2>7. 免责声明</h2>
          <p>本应用按"现状"和"可用性"提供，不提供任何明示或暗示的保证。我们不保证应用将不间断、及时、安全或无错误，也不保证结果将准确或可靠。</p>
          
          <h2>8. 责任限制</h2>
          <p>在法律允许的最大范围内，我们对因使用或无法使用本应用而导致的任何直接、间接、附带、特殊、惩罚性或后果性损害不承担责任。</p>
          
          <h2>9. 条款修改</h2>
          <p>我们保留随时修改这些条款的权利。修改后的条款将在应用中发布。您在修改后继续使用本应用即表示您接受修改后的条款。</p>
          
          <h2>10. 适用法律</h2>
          <p>这些条款受中国法律管辖，不考虑法律冲突原则。</p>
          
          <h2>11. 联系我们</h2>
          <p>如果您对本使用条款有任何疑问或建议，请通过以下方式联系我们：xk704274491@gmail.com</p>
        </div>
      </div>
      <Footer />
    </>
  );
}

function TermsSkeleton() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl space-y-6 animate-fade-in">
      <div className="flex flex-col items-center mb-8">
        <Skeleton className="h-12 w-12 mb-4 rounded-full" />
        <Skeleton className="h-10 w-48" />
      </div>
      
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-24 w-full" />
        
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
        
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
      </div>
    </div>
  );
}