import express from 'express';
import { createTag, getAllTags, getTagById, updateTag, deleteTag } from '../controller/tag.controller';

const router = express.Router();

router.post('/createTag', createTag);
router.get('/getAllTags', getAllTags);
router.get('/getTagById/:id', getTagById);
router.put('/updateTag/:id', updateTag);
router.delete('/deleteTag/:id', deleteTag);

export default router;
