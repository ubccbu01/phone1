 'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/components/CartContext';
import { useRouter } from 'next/navigation';

const brandName =
  process.env.NEXT_PUBLIC_BRAND_NAME || 'Your Brand';
const companyLegal =
  process.env.NEXT_PUBLIC_COMPANY_LEGAL ||
  'Your Company Legal Name';
const companyAddress =
  process.env.NEXT_PUBLIC_COMPANY_ADDRESS ||
  '183 หมู่ที่ 1 ตำบลคำตากล้า อำเภอคำตากล้า จังหวัดสกลนคร 47250';
const contactPhone =
  process.env.NEXT_PUBLIC_CONTACT_PHONE || '000-000-0000';
const contactEmail =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'support@example.com';

const CartPage = () => {
  const router = useRouter();
  const {
    items,
    cartCount,
    updateQuantity,
    removeFromCart,
    clearCart
  } = useCart();

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    province: '',
    district: '',
    zipcode: '',
    note: ''
  });
  const [status, setStatus] = useState(null);

  const cartTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleQtyChange = (id, value) => {
    const qty = parseInt(value, 10);
    if (!Number.isNaN(qty) && qty > 0) {
      updateQuantity(id, qty);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

const sendTikTokClickEvent = () => {
  fetch('/api/tiktok-event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: window.location.href,
      userAgent: navigator.userAgent,
      event: 'ClickButton',
    }),
  });
};


 
  const handleSubmit = async (e) => {
    e.preventDefault();

  // ✅ ยิง TikTok Event แค่กดปุ่ม
  sendTikTokClickEvent();
   
    if (!items.length) {
      alert('กรุณาเลือกสินค้าใส่ตะกร้าก่อนทำการสั่งซื้อ');
      return;
    }
    if (!form.fullName || !form.phone || !form.address) {
      alert('กรุณากรอกชื่อ เบอร์โทร และที่อยู่ให้ครบถ้วน');
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: form,
          items,
          total: cartTotal,
          paymentMethod: 'COD'
        })
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      clearCart();
      setStatus('success');
      router.push('/thank-you');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <section className="py-4 py-md-5 bg-light">
      <div className="container-md">
        <h1 className="mb-3">ตะกร้าสินค้า</h1>
        <p className="text-muted mb-4">
          ตรวจสอบรายการสินค้าให้เรียบร้อยก่อนกรอกข้อมูลจัดส่งและยืนยันการสั่งซื้อแบบ
          <strong> เก็บเงินปลายทาง (Cash on Delivery)</strong>
        </p>

        {items.length === 0 ? (
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <p className="mb-2">ยังไม่มีสินค้าในตะกร้า</p>
              <a href="/#products" className="btn btn-primary btn-sm">
                เลือกดูสินค้า
              </a>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {/* รายการสินค้า */}
            <div className="col-lg-7">
              <div className="card shadow-sm border-0 mb-4">
                <div className="card-body">
                  <h2 className="h5 mb-3">
                    รายการสินค้าในตะกร้า ({cartCount} ชิ้น)
                  </h2>
                  <div className="table-responsive">
                    <table className="table align-middle">
                      <thead>
                        <tr>
                          <th>สินค้า</th>
                          <th
                            className="text-center"
                            style={{ width: 120 }}
                          >
                            จำนวน
                          </th>
                          <th
                            className="text-end"
                            style={{ width: 120 }}
                          >
                            ราคารวม
                          </th>
                          <th style={{ width: 60 }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                {item.image && (
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={60}
                                    height={60}
                                    style={{
                                      objectFit: 'cover',
                                      borderRadius: 8,
                                      marginRight: 10
                                    }}
                                  />
                                )}
                                <div>
                                  <div className="fw-semibold">
                                    {item.name}
                                  </div>
                                  <div className="text-muted small">
                                    ฿{item.price.toLocaleString('th-TH')}{' '}
                                    / ชิ้น
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="text-center">
                              <input
                                type="number"
                                min="1"
                                className="form-control form-control-sm text-center"
                                style={{ width: 80, margin: '0 auto' }}
                                value={item.quantity}
                                onChange={(e) =>
                                  handleQtyChange(item.id, e.target.value)
                                }
                              />
                            </td>
                            <td className="text-end">
                              ฿{(item.price * item.quantity).toLocaleString(
                                'th-TH'
                              )}
                            </td>
                            <td className="text-end">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => removeFromCart(item.id)}
                              >
                                ลบ
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <th colSpan={2}>ยอดรวมค่าสินค้า</th>
                          <th className="text-end">
                            ฿{cartTotal.toLocaleString('th-TH')}
                          </th>
                          <th></th>
                        </tr>
                        <tr>
                          <td colSpan={4} className="text-end small">
                            * ราคานี้รวม{' '}
                            <strong>ค่าจัดส่งแบบเก็บเงินปลายทางฟรี</strong>{' '}
                            ตามเงื่อนไขด้านล่าง
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>

              {/* บล็อกอธิบายการจัดส่ง & COD */}
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <h2 className="h6 mb-3">
                    ข้อมูลการจัดส่งและการชำระเงิน (สำคัญ)
                  </h2>
                  <ul className="small mb-3">
                    <li>
                      <strong>วิธีจัดส่ง:</strong>{' '}
                      จัดส่งด้วยขนส่งเอกชนที่มีเลข Tracking
                      (เช่น Kerry / Flash / J&amp;T หรือบริษัทขนส่งที่ใกล้พื้นที่ของลูกค้า)
                    </li>
                    <li>
                      <strong>ระยะเวลาจัดส่งโดยประมาณ:</strong>{' '}
                      1–3 วันทำการในเขตตัวเมือง และ 2–5 วันทำการในพื้นที่ต่างจังหวัด
                      ทั้งนี้ขึ้นอยู่กับบริษัทขนส่งและพื้นที่ปลายทาง
                    </li>
                    <li>
                      <strong>ค่าจัดส่ง:</strong>{' '}
                      {brandName} ให้บริการ{' '}
                      <strong>จัดส่งฟรีแบบเก็บเงินปลายทาง</strong>{' '}
                      ภายในประเทศไทยสำหรับคำสั่งซื้อผ่านหน้าเว็บไซต์นี้
                    </li>
                    <li>
                      <strong>การเก็บเงินปลายทาง (COD):</strong>{' '}
                      ลูกค้าชำระเงินกับพนักงานจัดส่งเมื่อได้รับสินค้า
                      กรุณาเตรียมเงินสดให้พร้อมในวันที่จัดส่ง
                    </li>
                    <li>
                      <strong>การยืนยันคำสั่งซื้อ:</strong>{' '}
                      หลังส่งคำสั่งซื้อแล้ว
                      ทีมงานอาจติดต่อกลับทางเบอร์โทรศัพท์หรือช่องทางที่ให้ไว้
                      เพื่อยืนยันข้อมูลก่อนจัดส่งทุกครั้ง
                    </li>
                    <li>
                      <strong>การห่อและป้องกันสินค้า:</strong>{' '}
                      สินค้าทุกชิ้นมีการห่อกันกระแทก และบรรจุในกล่อง/ซองมาตรฐานของขนส่ง
                      เพื่อลดโอกาสการเสียหายระหว่างขนส่ง
                    </li>
                    <li>
                      <strong>กรณีปลายทางปฏิเสธรับสินค้า:</strong>{' '}
                      หากลูกค้ายกเลิกหรือปฏิเสธรับสินค้าหลายครั้ง
                      ทางร้านขอสงวนสิทธิ์ในการงดให้บริการเก็บเงินปลายทางในอนาคต
                      เพื่อป้องกันค่าใช้จ่ายด้านการจัดส่งที่ไม่จำเป็น
                    </li>
                    <li>
                      <strong>สินค้าเสียหายจากขนส่ง:</strong>{' '}
                      หากกล่องมีร่องรอยฉีกขาดหรือเสียหายอย่างเห็นได้ชัด
                      กรุณาถ่ายรูปไว้เป็นหลักฐานและติดต่อทีมงานทันทีผ่านเบอร์{' '}
                      {contactPhone} หรืออีเมล{' '}
                      <a href={`mailto:${contactEmail}`}>
                        {contactEmail}
                      </a>
                    </li>
                  </ul>
                  <p className="small text-muted mb-0">
                    ข้อมูลนี้จัดทำขึ้นเพื่อให้ลูกค้าทราบเงื่อนไขการจัดส่งและการชำระเงินอย่างโปร่งใส
                    ไม่ได้เป็นการโฆษณาเกินจริงหรือล่อให้เข้าใจผิด
                    เพื่อให้เป็นไปตามหลักเกณฑ์ด้านโฆษณาออนไลน์และนโยบายของแพลตฟอร์มต่าง ๆ
                    รวมถึง Google Ads
                  </p>
                </div>
              </div>
            </div>

            {/* ฟอร์มเก็บเงินปลายทาง */}
            <div className="col-lg-5">
              <div className="card shadow-sm border-0 mb-3">
                <div className="card-body">
                  <h2 className="h5 mb-3">ข้อมูลสำหรับจัดส่งและเก็บเงินปลายทาง</h2>
                  <p className="text-muted small mb-3">
                    กรุณากรอกข้อมูลตามจริงให้ครบถ้วน
                    เพื่อให้บริษัทขนส่งสามารถติดต่อและจัดส่งสินค้าได้อย่างรวดเร็วและถูกต้อง
                  </p>

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">ชื่อ – นามสกุล *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleFormChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">เบอร์โทรศัพท์ *</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="phone"
                        value={form.phone}
                        onChange={handleFormChange}
                        placeholder="เช่น 0912345678"
                        required
                      />
                      <div className="form-text small">
                        กรุณาใช้เบอร์ที่สามารถติดต่อได้ในช่วงวัน–เวลาทำการ
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        ที่อยู่สำหรับจัดส่ง (บ้านเลขที่, หมู่บ้าน, ซอย, ถนน) *
                      </label>
                      <textarea
                        className="form-control"
                        name="address"
                        rows={3}
                        value={form.address}
                        onChange={handleFormChange}
                        required
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">อำเภอ/เขต</label>
                        <input
                          type="text"
                          className="form-control"
                          name="district"
                          value={form.district}
                          onChange={handleFormChange}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">จังหวัด</label>
                        <input
                          type="text"
                          className="form-control"
                          name="province"
                          value={form.province}
                          onChange={handleFormChange}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">รหัสไปรษณีย์</label>
                      <input
                        type="text"
                        className="form-control"
                        name="zipcode"
                        value={form.zipcode}
                        onChange={handleFormChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">หมายเหตุเพิ่มเติม</label>
                      <textarea
                        className="form-control"
                        name="note"
                        rows={2}
                        value={form.note}
                        onChange={handleFormChange}
                        placeholder="เช่น ฝากของไว้กับ รปภ., โทรก่อนส่ง"
                      />
                    </div>

                    <div className="mb-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="codConfirm"
                          required
                        />
                        <label
                          className="form-check-label small"
                          htmlFor="codConfirm"
                        >
                          ยืนยันการสั่งซื้อแบบเก็บเงินปลายทาง และยอมรับเงื่อนไขการจัดส่งตามที่ระบุไว้ด้านบน
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary w-100"
                      disabled={status === 'loading'}
                    >
                      {status === 'loading'
                        ? 'กำลังส่งคำสั่งซื้อ...'
                        : `ยืนยันสั่งซื้อเก็บเงินปลายทาง (฿${cartTotal.toLocaleString(
                            'th-TH'
                          )})`}
                    </button>

                    {status === 'error' && (
                      <p className="mt-3 text-danger small">
                        เกิดข้อผิดพลาดในการส่งคำสั่งซื้อ กรุณาลองใหม่อีกครั้ง
                        หรือแจ้งปัญหาที่ {contactPhone} /{' '}
                        <a href={`mailto:${contactEmail}`}>
                          {contactEmail}
                        </a>
                      </p>
                    )}
                  </form>
                </div>
              </div>

              {/* กล่องข้อมูลร้าน */}
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <h2 className="h6 mb-2">ข้อมูลร้านค้า</h2>
                  <p className="small mb-1 fw-bold">{companyLegal}</p>
                  <p className="small mb-1">{companyAddress}</p>
                  <p className="small mb-1">โทร: {contactPhone}</p>
                  <p className="small mb-0">
                    อีเมล:{' '}
                    <a href={`mailto:${contactEmail}`}>
                      {contactEmail}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CartPage;
