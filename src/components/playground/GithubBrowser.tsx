
import React, { useState } from 'react';
import { Octokit } from 'octokit';
import { useQuery } from '@tanstack/react-query';
import { Folder, File, ChevronRight, ChevronDown, Github } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface GithubBrowserProps {
  onFileSelect: (content: string, fileName: string) => void;
}

interface RepoContent {
  name: string;
  path: string;
  type: string;
  sha: string;
}

export const GithubBrowser: React.FC<GithubBrowserProps> = ({ onFileSelect }) => {
  const [repoUrl, setRepoUrl] = useState('');
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [currentPath, setCurrentPath] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const octokit = new Octokit();

  const parseGithubUrl = (url: string) => {
    try {
      const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (match) {
        setOwner(match[1]);
        setRepo(match[2].replace('.git', ''));
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const { data: contents, isLoading } = useQuery({
    queryKey: ['repo-contents', owner, repo, currentPath],
    queryFn: async () => {
      if (!owner || !repo) return null;
      const response = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: currentPath,
      });
      return Array.isArray(response.data) ? response.data : [response.data];
    },
    enabled: !!owner && !!repo,
  });

  const handleFileClick = async (path: string, fileName: string) => {
    try {
      const response = await octokit.rest.repos.getContent({
        owner,
        repo,
        path,
      });
      
      if ('content' in response.data) {
        const content = Buffer.from(response.data.content, 'base64').toString();
        onFileSelect(content, fileName);
        toast({
          description: `Loaded ${fileName}`,
        });
      }
    } catch (error) {
      toast({
        description: "Failed to load file",
        variant: "destructive",
      });
    }
  };

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const handleLoadRepo = () => {
    if (parseGithubUrl(repoUrl)) {
      setCurrentPath('');
      setExpandedFolders(new Set());
    } else {
      toast({
        description: "Invalid GitHub URL",
        variant: "destructive",
      });
    }
  };

  const renderItem = (item: RepoContent) => {
    const isFolder = item.type === 'dir';
    const isExpanded = expandedFolders.has(item.path);

    return (
      <div key={item.path} className="ml-4">
        <div
          className="flex items-center gap-2 py-1 px-2 hover:bg-accent rounded-md cursor-pointer"
          onClick={() => isFolder ? toggleFolder(item.path) : handleFileClick(item.path, item.name)}
        >
          {isFolder ? (
            <>
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              <Folder className="h-4 w-4" />
            </>
          ) : (
            <>
              <div className="w-4" />
              <File className="h-4 w-4" />
            </>
          )}
          <span className="text-sm">{item.name}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col gap-4 p-4 border-r">
      <div className="flex gap-2">
        <Input
          placeholder="GitHub repository URL"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
        />
        <Button variant="outline" onClick={handleLoadRepo}>
          <Github className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : contents ? (
          <div className="space-y-1">
            {contents.map(renderItem)}
          </div>
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            Enter a GitHub repository URL to browse files
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
