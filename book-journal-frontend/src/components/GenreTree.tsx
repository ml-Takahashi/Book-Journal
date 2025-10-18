import { useEffect, useMemo, useState, type MouseEvent } from 'react';
import type { GenreTreeNode } from '../utils/genreTree';

interface GenreTreeProps {
  nodes: GenreTreeNode[];
  activeId: string | null;
  onSelect: (id: string) => void;
  depth?: number;
}

const containsActive = (node: GenreTreeNode, activeId: string | null): boolean => {
  if (!activeId) return false;
  if (node.id === activeId) return true;
  return node.children.some((child) => containsActive(child, activeId));
};

export function GenreTree({
  nodes,
  activeId,
  onSelect,
  depth = 0,
}: GenreTreeProps) {
  return (
    <div className="genre-tree">
      {nodes.map((node) => (
        <GenreTreeBranch
          key={node.id}
          node={node}
          depth={depth}
          activeId={activeId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

function GenreTreeBranch({
  node,
  depth,
  activeId,
  onSelect,
}: {
  node: GenreTreeNode;
  depth: number;
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  const hasChildren = node.children.length > 0;
  const isActive = node.id === activeId;
  const hasActiveDescendant = useMemo(
    () => containsActive(node, activeId),
    [node, activeId],
  );
  const [expanded, setExpanded] = useState(
    depth === 0 || isActive || hasActiveDescendant,
  );

  useEffect(() => {
    if (hasActiveDescendant || isActive) {
      setExpanded(true);
    }
  }, [hasActiveDescendant, isActive]);

  const toggleExpansion = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setExpanded((value) => !value);
  };

  return (
    <div className="genre-branch" data-depth={depth}>
      <div className="genre-row">
        {hasChildren ? (
          <button
            type="button"
            className={`branch-toggle ${expanded ? 'expanded' : ''}`}
            onClick={toggleExpansion}
            aria-label={expanded ? 'Collapse genre' : 'Expand genre'}
          >
            <span className="material-symbol">
              {expanded ? 'expand_more' : 'chevron_right'}
            </span>
          </button>
        ) : (
          <span className="branch-spacer" />
        )}
        <button
          type="button"
          className={`genre-item ${isActive ? 'active' : ''}`}
          onClick={() => onSelect(node.id)}
          style={{ paddingLeft: `${depth * 12 + 12}px` }}
        >
          <div className="genre-label">
            <span className="material-symbol">folder</span>
            {node.name}
          </div>
          <span className="badge">{node.totalBooks}</span>
        </button>
      </div>
      {hasChildren && expanded && (
        <div className="genre-children">
          <GenreTree
            nodes={node.children}
            activeId={activeId}
            onSelect={onSelect}
            depth={depth + 1}
          />
        </div>
      )}
    </div>
  );
}
