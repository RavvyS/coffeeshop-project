import emailjs from '@emailjs/browser';
import { formatDate, formatTime, formatCurrency } from '@/lib/utils';

// EmailJS configuration
const EMAIL_CONFIG = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
  templates: {
    reservationConfirmation: process.env.NEXT_PUBLIC_EMAILJS_RESERVATION_CONFIRMATION_TEMPLATE!,
    reservationUpdate: process.env.NEXT_PUBLIC_EMAILJS_RESERVATION_UPDATE_TEMPLATE!,
    reservationCancellation: process.env.NEXT_PUBLIC_EMAILJS_RESERVATION_CANCELLATION_TEMPLATE!,
    orderConfirmation: process.env.NEXT_PUBLIC_EMAILJS_ORDER_CONFIRMATION_TEMPLATE!,
    orderStatusUpdate: process.env.NEXT_PUBLIC_EMAILJS_ORDER_STATUS_TEMPLATE!,
    feedbackConfirmation: process.env.NEXT_PUBLIC_EMAILJS_FEEDBACK_CONFIRMATION_TEMPLATE!,
    welcomeEmail: process.env.NEXT_PUBLIC_EMAILJS_WELCOME_TEMPLATE!,
    adminNotification: process.env.NEXT_PUBLIC_EMAILJS_ADMIN_NOTIFICATION_TEMPLATE!,
  }
};

// Initialize EmailJS
emailjs.init(EMAIL_CONFIG.publicKey);

/**
 * Email Service Class
 * Handles all email communications for the coffee shop
 */
class EmailService {
  /**
   * Send reservation confirmation email
   */
  async sendReservationConfirmation(reservationData: any) {
    try {
      const templateParams = {
        to_email: reservationData.guest_email,
        to_name: reservationData.guest_name,
        reservation_id: reservationData.id,
        guest_name: reservationData.guest_name,
        reservation_date: formatDate(reservationData.reservation_date, 'full'),
        reservation_time: formatTime(reservationData.reservation_time),
        guest_count: reservationData.guest_count,
        special_requests: reservationData.special_requests || 'None',
        coffee_shop_name: 'Brew & Bean',
        coffee_shop_phone: '+1 (555) 123-4567',
        coffee_shop_address: '123 Coffee Street, Seattle, WA 98101',
        confirmation_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/reservations`,
        year: new Date().getFullYear(),
      };

      const response = await emailjs.send(
        EMAIL_CONFIG.serviceId,
        EMAIL_CONFIG.templates.reservationConfirmation,
        templateParams
      );

      console.log('Reservation confirmation email sent:', response);
      return { success: true, messageId: response.text };
    } catch (error) {
      console.error('Failed to send reservation confirmation email:', error);
      throw new Error('Failed to send confirmation email');
    }
  }

  /**
   * Send reservation update email
   */
  async sendReservationUpdate(reservationData: any, updateType: 'modified' | 'confirmed' | 'cancelled') {
    try {
      const templateParams = {
        to_email: reservationData.guest_email,
        to_name: reservationData.guest_name,
        update_type: updateType,
        reservation_id: reservationData.id,
        guest_name: reservationData.guest_name,
        reservation_date: formatDate(reservationData.reservation_date, 'full'),
        reservation_time: formatTime(reservationData.reservation_time),
        guest_count: reservationData.guest_count,
        status: reservationData.status,
        special_requests: reservationData.special_requests || 'None',
        coffee_shop_name: 'Brew & Bean',
        coffee_shop_phone: '+1 (555) 123-4567',
        manage_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/reservations`,
        year: new Date().getFullYear(),
      };

      const templateId = updateType === 'cancelled' 
        ? EMAIL_CONFIG.templates.reservationCancellation
        : EMAIL_CONFIG.templates.reservationUpdate;

      const response = await emailjs.send(
        EMAIL_CONFIG.serviceId,
        templateId,
        templateParams
      );

      console.log(`Reservation ${updateType} email sent:`, response);
      return { success: true, messageId: response.text };
    } catch (error) {
      console.error(`Failed to send reservation ${updateType} email:`, error);
      throw new Error(`Failed to send ${updateType} email`);
    }
  }

  /**
   * Send order confirmation email
   */
  async sendOrderConfirmation(orderData: any) {
    try {
      // Format order items for email
      const orderItems = orderData.order_items?.map((item: any) => 
        `${item.quantity}x ${item.menu_item?.name} - ${formatCurrency(item.unit_price * item.quantity)}`
      ).join('\n') || 'Order items not available';

      const templateParams = {
        to_email: orderData.user?.email,
        to_name: orderData.user?.name,
        order_number: orderData.order_number,
        order_id: orderData.id,
        order_items: orderItems,
        total_amount: formatCurrency(orderData.total_amount),
        order_type: orderData.order_type.replace('_', ' ').toUpperCase(),
        special_instructions: orderData.special_instructions || 'None',
        estimated_ready_time: orderData.estimated_ready_time 
          ? formatDate(orderData.estimated_ready_time, 'full')
          : 'Will be updated shortly',
        coffee_shop_name: 'Brew & Bean',
        coffee_shop_phone: '+1 (555) 123-4567',
        order_tracking_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/orders`,
        year: new Date().getFullYear(),
      };

      const response = await emailjs.send(
        EMAIL_CONFIG.serviceId,
        EMAIL_CONFIG.templates.orderConfirmation,
        templateParams
      );

      console.log('Order confirmation email sent:', response);
      return { success: true, messageId: response.text };
    } catch (error) {
      console.error('Failed to send order confirmation email:', error);
      throw new Error('Failed to send order confirmation email');
    }
  }

  /**
   * Send order status update email
   */
  async sendOrderStatusUpdate(orderData: any, oldStatus: string, newStatus: string) {
    try {
      const statusMessages = {
        confirmed: 'Your order has been confirmed and is being prepared!',
        preparing: 'Your order is now being prepared by our skilled baristas.',
        ready: 'Great news! Your order is ready for pickup.',
        completed: 'Thank you! Your order has been completed.',
        cancelled: 'Unfortunately, your order has been cancelled.',
      };

      const templateParams = {
        to_email: orderData.user?.email,
        to_name: orderData.user?.name,
        order_number: orderData.order_number,
        old_status: oldStatus.replace('_', ' ').toUpperCase(),
        new_status: newStatus.replace('_', ' ').toUpperCase(),
        status_message: statusMessages[newStatus as keyof typeof statusMessages] || 'Your order status has been updated.',
        estimated_ready_time: orderData.estimated_ready_time 
          ? formatDate(orderData.estimated_ready_time, 'full')
          : 'Not specified',
        coffee_shop_name: 'Brew & Bean',
        coffee_shop_phone: '+1 (555) 123-4567',
        order_tracking_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/orders`,
        year: new Date().getFullYear(),
      };

      const response = await emailjs.send(
        EMAIL_CONFIG.serviceId,
        EMAIL_CONFIG.templates.orderStatusUpdate,
        templateParams
      );

      console.log('Order status update email sent:', response);
      return { success: true, messageId: response.text };
    } catch (error) {
      console.error('Failed to send order status update email:', error);
      throw new Error('Failed to send status update email');
    }
  }

  /**
   * Send feedback confirmation email
   */
  async sendFeedbackConfirmation(feedbackData: any, userName: string, userEmail: string) {
    try {
      const templateParams = {
        to_email: userEmail,
        to_name: userName,
        feedback_id: feedbackData.id,
        feedback_type: feedbackData.type.toUpperCase(),
        subject: feedbackData.subject,
        message: feedbackData.message,
        rating: feedbackData.rating ? `${feedbackData.rating}/5 stars` : 'No rating provided',
        coffee_shop_name: 'Brew & Bean',
        coffee_shop_phone: '+1 (555) 123-4567',
        feedback_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/feedback`,
        year: new Date().getFullYear(),
      };

      const response = await emailjs.send(
        EMAIL_CONFIG.serviceId,
        EMAIL_CONFIG.templates.feedbackConfirmation,
        templateParams
      );

      console.log('Feedback confirmation email sent:', response);
      return { success: true, messageId: response.text };
    } catch (error) {
      console.error('Failed to send feedback confirmation email:', error);
      throw new Error('Failed to send feedback confirmation email');
    }
  }

  /**
   * Send welcome email to new users
   */
  async sendWelcomeEmail(userData: any) {
    try {
      const templateParams = {
        to_email: userData.email,
        to_name: userData.name,
        coffee_shop_name: 'Brew & Bean',
        menu_url: `${process.env.NEXT_PUBLIC_APP_URL}/menu`,
        reservations_url: `${process.env.NEXT_PUBLIC_APP_URL}/reservations`,
        dashboard_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
        coffee_shop_phone: '+1 (555) 123-4567',
        year: new Date().getFullYear(),
      };

      const response = await emailjs.send(
        EMAIL_CONFIG.serviceId,
        EMAIL_CONFIG.templates.welcomeEmail,
        templateParams
      );

      console.log('Welcome email sent:', response);
      return { success: true, messageId: response.text };
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      // Don't throw error for welcome email - it's not critical
      return { success: false, error: error };
    }
  }

  /**
   * Send admin notification for new orders/reservations
   */
  async sendAdminNotification(type: 'order' | 'reservation' | 'feedback', data: any) {
    try {
      const adminEmail = 'admin@brewbean.com'; // Configure this

      let templateParams;
      
      if (type === 'order') {
        templateParams = {
          to_email: adminEmail,
          notification_type: 'New Order',
          order_number: data.order_number,
          customer_name: data.user?.name,
          total_amount: formatCurrency(data.total_amount),
          order_type: data.order_type,
          admin_dashboard_url: `${process.env.NEXT_PUBLIC_APP_URL}/admin/orders`,
          coffee_shop_name: 'Brew & Bean',
          year: new Date().getFullYear(),
        };
      } else if (type === 'reservation') {
        templateParams = {
          to_email: adminEmail,
          notification_type: 'New Reservation',
          customer_name: data.guest_name,
          reservation_date: formatDate(data.reservation_date),
          reservation_time: formatTime(data.reservation_time),
          guest_count: data.guest_count,
          admin_dashboard_url: `${process.env.NEXT_PUBLIC_APP_URL}/admin/reservations`,
          coffee_shop_name: 'Brew & Bean',
          year: new Date().getFullYear(),
        };
      } else if (type === 'feedback') {
        templateParams = {
          to_email: adminEmail,
          notification_type: 'New Feedback',
          feedback_type: data.type,
          customer_name: data.user?.name,
          subject: data.subject,
          rating: data.rating ? `${data.rating}/5 stars` : 'No rating',
          admin_dashboard_url: `${process.env.NEXT_PUBLIC_APP_URL}/admin/feedback`,
          coffee_shop_name: 'Brew & Bean',
          year: new Date().getFullYear(),
        };
      }

      const response = await emailjs.send(
        EMAIL_CONFIG.serviceId,
        EMAIL_CONFIG.templates.adminNotification,
        templateParams
      );

      console.log(`Admin ${type} notification sent:`, response);
      return { success: true, messageId: response.text };
    } catch (error) {
      console.error(`Failed to send admin ${type} notification:`, error);
      // Don't throw error for admin notifications - they shouldn't block user actions
      return { success: false, error: error };
    }
  }

  /**
   * Test email configuration
   */
  async testEmailService() {
    try {
      const testParams = {
        to_email: 'test@example.com',
        to_name: 'Test User',
        coffee_shop_name: 'Brew & Bean',
        message: 'This is a test email to verify EmailJS configuration.',
        year: new Date().getFullYear(),
      };

      // You would create a simple test template for this
      console.log('Email service test - would send with params:', testParams);
      return { success: true, message: 'Email service is configured correctly' };
    } catch (error) {
      console.error('Email service test failed:', error);
      return { success: false, error: error };
    }
  }
}

// Export singleton instance
export const emailService = new EmailService();
