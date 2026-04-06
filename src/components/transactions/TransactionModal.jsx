import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  MenuItem, 
  IconButton,
  Grid
} from '@mui/material';
import { X } from 'lucide-react';
import { useFinance } from '../../store/useFinance';
import { categories } from '../../data/mockData';

const TransactionModal = ({ open, handleClose, transactionToEdit = null }) => {
  const { addTransaction, updateTransaction } = useFinance();
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    note: ''
  });

  useEffect(() => {
    if (transactionToEdit) {
      setFormData({
        ...transactionToEdit,
        date: transactionToEdit.date.split('T')[0] // Ensure date format is YYYY-MM-DD
      });
    } else {
      setFormData({
        type: 'expense',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        note: ''
      });
    }
  }, [transactionToEdit, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.category) return;
    
    if (transactionToEdit) {
      updateTransaction({
        ...formData,
        amount: parseFloat(formData.amount)
      });
    } else {
      addTransaction({
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        amount: parseFloat(formData.amount)
      });
    }
    handleClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      fullWidth 
      maxWidth="sm"
      PaperProps={{
        style: { borderRadius: '24px', padding: '12px' }
      }}
    >
      <DialogTitle className="flex items-center justify-between">
        <span className="text-xl font-bold text-slate-800">
          {transactionToEdit ? 'Edit Transaction' : 'Add New Transaction'}
        </span>
        <IconButton onClick={handleClose} size="small">
          <X size={20} />
        </IconButton>
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent dividers className="space-y-4">
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField
                select
                fullWidth
                label="Type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                variant="outlined"
              >
                <MenuItem value="income">Income</MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                fullWidth
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                variant="outlined"
                required
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="date"
                label="Date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Note"
                multiline
                rows={2}
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                variant="outlined"
                placeholder="What was this for?"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={handleClose} color="inherit" className="rounded-xl px-6">
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disableElevation 
            className="rounded-xl px-8 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {transactionToEdit ? 'Update Details' : 'Initialize Node'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TransactionModal;
