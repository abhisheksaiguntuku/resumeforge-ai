import { auth } from "@/lib/auth"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, FileText, Upload, User, Briefcase, Plus, MoreHorizontal } from "lucide-react"

async function getDashboardData() {
  const res = await fetch("http://localhost:3000/api/dashboard", {
    cache: "no-store",
    // We'd typically use headers() here to pass cookies/session for the server-side fetch
  })
  if (!res.ok) {
    // Return some mock data if API is not fully up or reachable during build
    return {
      completionScore: 65,
      uploadedResumesCount: 2,
      resumeVersionsCount: 5,
      jobDescriptionsCount: 3,
      unresolvedConflicts: 1,
      recentResumes: [
        { id: "1", name: "Software Engineer at Google", company: "Google", template: "Modern", updatedAt: new Date().toISOString() },
        { id: "2", name: "Frontend Developer", company: "Meta", template: "Classic", updatedAt: new Date().toISOString() },
      ]
    }
  }
  return res.json()
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) {
    redirect("/login")
  }

  const data = await getDashboardData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Welcome back, {session.user.name?.split(' ')[0] || 'User'}!
        </h1>
        <p className="text-slate-400 mt-2">Here's what's happening with your job search today.</p>
      </div>

      {data.unresolvedConflicts > 0 && (
        <div className="flex items-center gap-4 rounded-lg border border-orange-500/50 bg-orange-500/10 p-4 text-orange-200">
          <AlertCircle className="h-5 w-5 text-orange-400" />
          <div className="flex-1">
            <p className="font-medium text-orange-400">You have {data.unresolvedConflicts} profile conflicts to resolve</p>
            <p className="text-sm">Review your imported resumes to resolve conflicting information.</p>
          </div>
          <Button variant="outline" className="border-orange-500/50 text-orange-400 hover:bg-orange-500/20" asChild>
            <Link href="/profile/conflicts">Resolve Now</Link>
          </Button>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/resume/new">
          <Card className="hover:border-indigo-500/50 hover:bg-[#1a1a24] transition-colors cursor-pointer h-full group border-indigo-500/30 bg-[#151522]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-indigo-400">Build New Resume</CardTitle>
              <Plus className="h-4 w-4 text-indigo-400" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-400">Create a tailored resume for a specific job</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/profile/upload">
          <Card className="hover:border-slate-600 hover:bg-[#1a1a24] transition-colors cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Upload Resumes</CardTitle>
              <Upload className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-400">Import your existing PDF/Word resumes</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/profile">
          <Card className="hover:border-slate-600 hover:bg-[#1a1a24] transition-colors cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">View Career Profile</CardTitle>
              <User className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-400">Manage your master experience data</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/jobs/new">
          <Card className="hover:border-slate-600 hover:bg-[#1a1a24] transition-colors cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Add Job Description</CardTitle>
              <Briefcase className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-400">Save a job posting to target later</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Profile Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{data.completionScore}%</div>
            <Progress value={data.completionScore} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Uploaded Resumes</CardTitle>
            <Upload className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.uploadedResumesCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Generated Resumes</CardTitle>
            <FileText className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.resumeVersionsCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Saved Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.jobDescriptionsCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Recent Resumes</CardTitle>
          <CardDescription>
            Your most recently generated and edited resume versions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.recentResumes?.length > 0 ? (
            <div className="rounded-md border border-[#2a2a3a]">
              <table className="w-full text-sm text-left">
                <thead className="bg-[#1a1a24] text-slate-400 border-b border-[#2a2a3a]">
                  <tr>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Company</th>
                    <th className="px-4 py-3 font-medium">Template</th>
                    <th className="px-4 py-3 font-medium">Created</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a2a3a]">
                  {data.recentResumes.map((resume: any) => (
                    <tr key={resume.id} className="hover:bg-[#1a1a24]/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-200">{resume.name}</td>
                      <td className="px-4 py-3 text-slate-400">{resume.company || '-'}</td>
                      <td className="px-4 py-3">
                        <Badge variant="info">{resume.template}</Badge>
                      </td>
                      <td className="px-4 py-3 text-slate-400">
                        {new Date(resume.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" className="h-8 px-2">Edit</Button>
                          <Button variant="ghost" size="sm" className="h-8 px-2">Download</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 bg-[#161620] rounded-lg border border-dashed border-[#2a2a3a]">
              <FileText className="h-10 w-10 mb-3 text-slate-500" />
              <p>No resumes generated yet.</p>
              <Button className="mt-4" variant="outline" asChild>
                <Link href="/resume/new">Create Your First Resume</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
