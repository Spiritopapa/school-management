/**
 * School Management System - Fees Management Module
 * Handles fees payment tracking, receipts generation and financial records
 */

let feesModal, receiptModal;

function openFeesPayment(studentId = null) {
    const students = storage.get('students') || [];
    
    const modalHtml = `
    <div class="modal fade" id="feesModal" tabindex="-1" aria-labelledby="feesModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="feesModalLabel">Fees Payment</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="feesForm">
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label class="form-label">Select Student</label>
                                <select class="form-select" id="fees-student" required>
                                    <option value="">Select Student</option>
                                    ${students.map(s => `<option value="${s.id}" ${studentId === s.id ? 'selected' : ''}>${s.name} - ${s.classId || 'No Class'}</option>`).join('')}
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Academic Term</label>
                                <select class="form-select" id="fees-term" required>
                                    <option value="">Select Term</option>
                                    <option value="Term 1">Term 1</option>
                                    <option value="Term 2">Term 2</option>
                                    <option value="Term 3">Term 3</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label class="form-label">Total Fees Amount (GH₵)</label>
                                <input type="number" step="0.01" class="form-control" id="fees-total" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Amount Paid (GH₵)</label>
                                <input type="number" step="0.01" class="form-control" id="fees-paid" required>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Payment Date</label>
                            <input type="date" class="form-control" id="fees-date" value="${new Date().toISOString().split('T')[0]}">
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Payment Method</label>
                            <select class="form-select" id="fees-method">
                                <option value="Cash">Cash</option>
                                <option value="Mobile Money">Mobile Money</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                                <option value="Cheque">Cheque</option>
                            </select>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Notes / Remarks</label>
                            <textarea class="form-control" id="fees-notes" rows="2"></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-success" onclick="processFeesPayment()">
                        <i class="bi bi-check-circle"></i> Process Payment & Generate Receipt
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;
    
    document.getElementById('modals-container').innerHTML = modalHtml;
    feesModal = new bootstrap.Modal(document.getElementById('feesModal'));
    feesModal.show();
}

function processFeesPayment() {
    const studentId = document.getElementById('fees-student').value;
    const students = storage.get('students') || [];
    const student = students.find(s => s.id === studentId);
    
    const paymentData = {
        id: generateId(),
        studentId: studentId,
        studentName: student ? student.name : '',
        term: document.getElementById('fees-term').value,
        totalAmount: parseFloat(document.getElementById('fees-total').value),
        amountPaid: parseFloat(document.getElementById('fees-paid').value),
        date: document.getElementById('fees-date').value,
        method: document.getElementById('fees-method').value,
        notes: document.getElementById('fees-notes').value,
        receiptNumber: `RCP-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
        createdAt: new Date().toISOString()
    };
    
    // Calculate balance
    paymentData.balance = paymentData.totalAmount - paymentData.amountPaid;
    paymentData.status = paymentData.balance <= 0 ? 'Fully Paid' : 'Partially Paid';
    
    // Save payment record
    const fees = storage.get('fees') || [];
    fees.push(paymentData);
    storage.set('fees', fees);
    
    showNotification('Payment recorded successfully! Receipt generated.', 'success');
    feesModal.hide();
    
    // Show receipt automatically
    setTimeout(() => showReceipt(paymentData.id), 500);
}

function showReceipt(receiptId) {
    const fees = storage.get('fees') || [];
    const receipt = fees.find(f => f.id === receiptId);
    
    if (!receipt) return;
    
    const receiptHtml = `
    <div class="modal fade" id="receiptModal" tabindex="-1" aria-labelledby="receiptModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header bg-success text-white">
                    <h5 class="modal-title" id="receiptModalLabel">
                        <i class="bi bi-receipt"></i> Official Payment Receipt
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="text-center mb-4">
                        <h4><strong>SCHOOL MANAGEMENT SYSTEM</strong></h4>
                        <p class="text-muted">Official Payment Receipt</p>
                        <hr>
                    </div>
                    
                    <div class="row mb-2">
                        <div class="col-6"><strong>Receipt No:</strong></div>
                        <div class="col-6 text-end">${receipt.receiptNumber}</div>
                    </div>
                    
                    <div class="row mb-2">
                        <div class="col-6"><strong>Date:</strong></div>
                        <div class="col-6 text-end">${formatDate(receipt.date)}</div>
                    </div>
                    
                    <div class="row mb-2">
                        <div class="col-6"><strong>Student Name:</strong></div>
                        <div class="col-6 text-end">${receipt.studentName}</div>
                    </div>
                    
                    <div class="row mb-2">
                        <div class="col-6"><strong>Term:</strong></div>
                        <div class="col-6 text-end">${receipt.term}</div>
                    </div>
                    
                    <div class="row mb-2">
                        <div class="col-6"><strong>Payment Method:</strong></div>
                        <div class="col-6 text-end">${receipt.method}</div>
                    </div>
                    
                    <hr>
                    
                    <div class="row mb-2">
                        <div class="col-6"><strong>Total Fees:</strong></div>
                        <div class="col-6 text-end">GH₵ ${receipt.totalAmount.toFixed(2)}</div>
                    </div>
                    
                    <div class="row mb-2">
                        <div class="col-6"><strong>Amount Paid:</strong></div>
                        <div class="col-6 text-end"><strong>GH₵ ${receipt.amountPaid.toFixed(2)}</strong></div>
                    </div>
                    
                    <div class="row mb-2">
                        <div class="col-6"><strong>Balance:</strong></div>
                        <div class="col-6 text-end text-${receipt.balance > 0 ? 'danger' : 'success'}">
                            GH₵ ${receipt.balance.toFixed(2)}
                        </div>
                    </div>
                    
                    <div class="row mb-3">
                        <div class="col-12">
                            <span class="badge bg-${receipt.status === 'Fully Paid' ? 'success' : 'warning'} w-100 py-2">
                                ${receipt.status}
                            </span>
                        </div>
                    </div>
                    
                    ${receipt.notes ? `<div class="alert alert-info"><strong>Notes:</strong> ${receipt.notes}</div>` : ''}
                    
                    <div class="text-center mt-4 text-muted small">
                        <p>This is an official computer generated receipt. No signature required.</p>
                        <p>Thank you for your payment!</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" onclick="printReceipt()">
                        <i class="bi bi-printer"></i> Print Receipt
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;
    
    document.getElementById('modals-container').innerHTML = receiptHtml;
    receiptModal = new bootstrap.Modal(document.getElementById('receiptModal'));
    receiptModal.show();
}

function printReceipt() {
    window.print();
}

function loadFeesRecords() {
    const tbody = document.querySelector('#fees-table tbody');
    
    // If element not found (on login page), exit silently
    if (!tbody) return;
    
    const fees = storage.get('fees') || [];
    const students = storage.get('students') || [];
    
    tbody.innerHTML = '';
    
    fees.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.receiptNumber}</td>
            <td>${record.studentName}</td>
            <td>${record.term}</td>
            <td>GH₵ ${record.totalAmount.toFixed(2)}</td>
            <td>GH₵ ${record.amountPaid.toFixed(2)}</td>
            <td class="text-${record.balance > 0 ? 'danger' : 'success'}">GH₵ ${record.balance.toFixed(2)}</td>
            <td><span class="badge bg-${record.status === 'Fully Paid' ? 'success' : 'warning'}">${record.status}</span></td>
            <td>${formatDate(record.date)}</td>
            <td>
                <div class="d-flex gap-1">
                    <button class="btn btn-sm btn-outline-info" onclick="showReceipt('${record.id}')">
                        <i class="bi bi-receipt"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteFeesRecord('${record.id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function deleteFeesRecord(recordId) {
    if (confirm('Are you sure you want to delete this payment record?')) {
        const fees = storage.get('fees') || [];
        const updated = fees.filter(f => f.id !== recordId);
        storage.set('fees', updated);
        showNotification('Payment record deleted successfully', 'success');
        loadFeesRecords();
    }
}