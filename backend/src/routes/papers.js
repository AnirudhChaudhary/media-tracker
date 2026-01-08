import express from 'express';
import * as db from '../storage/database.js';
import { fetchArxivPapers } from '../services/arxiv.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const papers = await db.getAllPapers();
    res.json(papers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/config', async (req, res) => {
  try {
    const config = await db.getResearchConfig();
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const categories = await db.getArxivCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/test-arxiv', async (req, res) => {
  try {
    // Test with a simple query for recent CS papers
    const papers = await fetchArxivPapers(['cs.AI'], 10, 30); // Last 30 days, AI only
    res.json({ 
      message: 'Test query results',
      papers: papers.slice(0, 3), // Show first 3 papers
      total: papers.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/fetch', async (req, res) => {
  try {
    const activeAreas = await db.getActiveResearchAreas();
    const allCategories = [...new Set(activeAreas.flatMap(area => area.categories))];
    
    if (allCategories.length === 0) {
      return res.json({ 
        message: 'No active research areas configured', 
        added: 0, 
        total_fetched: 0,
        debug: { activeAreas: activeAreas.length }
      });
    }
    
    console.log('Fetching papers for categories:', allCategories);
    const arxivPapers = await fetchArxivPapers(allCategories, 20, 14); // Further reduced
    console.log('ArXiv returned:', arxivPapers.length, 'papers');
    
    const addedPapers = [];
    
    for (const paper of arxivPapers) {
      const added = await db.addPaper(paper);
      if (added) addedPapers.push(added);
    }
    
    res.json({ 
      message: `Fetched ${arxivPapers.length} papers, added ${addedPapers.length} relevant papers`,
      added: addedPapers.length,
      total_fetched: arxivPapers.length,
      debug: { categories: allCategories, activeAreas: activeAreas.length }
    });
  } catch (error) {
    console.error('Fetch error:', error);
    if (error.message.includes('rate limit')) {
      res.status(429).json({ error: 'arXiv rate limit exceeded. Please try again in a few minutes.' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

router.get('/:id', async (req, res) => {
  try {
    const paper = await db.getPaperById(req.params.id);
    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' });
    }
    res.json(paper);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const updated = await db.updatePaper(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Paper not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.deletePaper(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/config', async (req, res) => {
  try {
    const updated = await db.updateResearchConfig(req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/areas/:id/toggle', async (req, res) => {
  try {
    const { enabled } = req.body;
    const updated = await db.toggleResearchArea(req.params.id, enabled);
    if (!updated) {
      return res.status(404).json({ error: 'Research area not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/areas', async (req, res) => {
  try {
    const updated = await db.addResearchArea(req.body);
    res.status(201).json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/areas/:id', async (req, res) => {
  try {
    const updated = await db.removeResearchArea(req.params.id);
    if (!updated) {
      return res.status(404).json({ error: 'Research area not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;