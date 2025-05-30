'use client';

import { Suspense } from 'react';
import { Triangle } from 'lucide-react';
import { useI18n } from '@/providers/i18n-provider';
import { Skeleton } from '@/components/ui/skeleton';
import Footer from '@/components/layout/footer';

export default function PrivacyPolicyPage() {
  return (
    <Suspense fallback={<PrivacyPolicySkeleton />}>
      <PrivacyPolicyContent />
    </Suspense>
  );
}

function PrivacyPolicyContent() {
  const { t, isLoaded } = useI18n();
  
  if (!isLoaded) {
    return <PrivacyPolicySkeleton />;
  }
  
  return (
    <>
      <div className="container mx-auto py-12 px-4 max-w-4xl">
        <div className="flex flex-col items-center mb-8">
          <Triangle className="h-12 w-12 text-primary mb-4" />
          <h1 className="text-3xl font-bold text-center">隐私权政策</h1>
        </div>
        
        <div className="prose dark:prose-invert max-w-none">
          <p>最后更新日期：{new Date().toLocaleDateString()}</p>
          
          <h2>1. 引言</h2>
          <p>欢迎使用我们的任务管理应用（以下简称"应用"）。我们非常重视您的隐私和个人信息保护。本隐私权政策旨在向您说明我们如何收集、使用、存储和保护您的个人信息。</p>
          
          <h2>2. 信息收集</h2>
          <p>我们可能收集以下类型的信息：</p>
          <ul>
            <li><strong>账户信息</strong>：当您注册账户时，我们会收集您的电子邮件地址和密码。</li>
            <li><strong>个人资料信息</strong>：您可能会提供姓名、头像等个人资料信息。</li>
            <li><strong>任务数据</strong>：您在应用中创建的任务、分类和其他内容。</li>
            <li><strong>使用数据</strong>：关于您如何使用应用的信息，如访问时间、使用的功能等。</li>
            <li><strong>设备信息</strong>：设备类型、操作系统、浏览器类型等技术信息。</li>
          </ul>
          
          <h2>3. 信息使用</h2>
          <p>我们使用收集的信息用于：</p>
          <ul>
            <li>提供、维护和改进我们的应用</li>
            <li>处理和管理您的账户</li>
            <li>响应您的请求和提供客户支持</li>
            <li>发送服务相关通知</li>
            <li>防止欺诈和滥用行为</li>
          </ul>
          
          <h2>4. 信息共享</h2>
          <p>我们不会出售您的个人信息。我们可能在以下情况下共享您的信息：</p>
          <ul>
            <li>经您同意</li>
            <li>与提供服务的第三方服务提供商（如云存储提供商）</li>
            <li>为遵守法律要求或保护我们的权利</li>
          </ul>
          
          <h2>5. 数据安全</h2>
          <p>我们采取合理的安全措施保护您的个人信息不被未经授权的访问、使用或披露。</p>
          
          <h2>6. 您的权利</h2>
          <p>您有权访问、更正或删除您的个人信息。您也可以选择停用您的账户。</p>
          
          <h2>7. 第三方服务</h2>
          <p>我们的应用可能包含第三方服务（如Google和GitHub登录）的链接。这些第三方有自己的隐私政策，我们建议您阅读这些政策。</p>
          
          <h2>8. 儿童隐私</h2>
          <p>我们的服务不面向13岁以下的儿童。我们不会故意收集13岁以下儿童的个人信息。</p>
          
          <h2>9. 隐私政策更新</h2>
          <p>我们可能会不时更新本隐私政策。更新后的政策将在应用中发布，并在重大变更时通知您。</p>
          
          <h2>10. 联系我们</h2>
          <p>如果您对本隐私政策有任何疑问或建议，请通过以下方式联系我们：xk704274491@gmail.com</p>
        </div>
      </div>
      <Footer />
    </>
  );
}

function PrivacyPolicySkeleton() {
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